import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AIService } from '../ai/ai-service';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { createClient as createSupabaseClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import pg from 'pg';
const { Pool } = pg;
import type { Database } from '../../types/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !DATABASE_URL) {
  throw new Error('Supabase credentials must be set in environment variables');
}

class SupabaseMcpServer {
  private server: Server;
  private supabaseClient: ReturnType<typeof createSupabaseClient<Database>>;
  private pgPool: pg.Pool;

  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
        version: '0.1.0'
      },
      {
        capabilities: {
          resources: {},
          tools: {}
        }
      }
    );

    this.supabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.pgPool = new Pool({
      connectionString: DATABASE_URL
    });
    this.setupToolHandlers();
  }

  private async withPgClient<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pgPool.connect();
    try {
      return await fn(client);
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        error instanceof Error ? error.message : 'Database operation failed'
      );
    } finally {
      client.release();
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query',
          description: 'Run a read-only SQL query',
          inputSchema: {
            type: 'object',
            properties: {
              sql: {
                type: 'string',
                description: 'The SELECT SQL query to execute'
              }
            },
            required: ['sql']
          }
        },
        {
          name: 'sql-agent',
          description: 'Execute SQL queries with advanced parsing and validation',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The SQL query to execute'
              },
              parameters: {
                type: 'array',
                description: 'Query parameters for prepared statements',
                items: {
                  type: 'string'
                }
              }
            },
            required: ['query']
          }
        },
        {
          name: 'describe-table',
          description: 'View schema information for a specific table',
          inputSchema: {
            type: 'object',
            properties: {
              table_name: {
                type: 'string',
                description: 'Name of table to describe'
              }
            },
            required: ['table_name']
          }
        },
        {
          name: 'list-tables',
          description: 'Get a list of all tables in the database',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'query': {
          const args = request.params.arguments;
          if (!args || typeof args.sql !== 'string') {
            throw new McpError(ErrorCode.InvalidParams, 'Invalid query arguments');
          }
          return this.withPgClient(async (client) => {
            const sql = args.sql as string;
            const result = await client.query(sql);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.rows, null, 2)
              }]
            };
          });
        }

        case 'describe-table': {
          const args = request.params.arguments;
          if (!args || typeof args.table_name !== 'string') {
            throw new McpError(ErrorCode.InvalidParams, 'Invalid table name');
          }
          return this.withPgClient(async (client) => {
            const result = await client.query(`
              SELECT column_name, data_type
              FROM information_schema.columns
              WHERE table_name = $1
            `, [args.table_name]);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.rows, null, 2)
              }]
            };
          });
        }

        case 'list-tables': {
          return this.withPgClient(async (client) => {
            const result = await client.query(`
              SELECT table_name
              FROM information_schema.tables
              WHERE table_schema = 'public'
            `);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.rows.map((row: { table_name: string }) => row.table_name), null, 2)
              }]
            };
          });
        }

        case 'sql-agent': {
          const args = request.params.arguments;
          if (!args || typeof args.query !== 'string') {
            throw new McpError(ErrorCode.InvalidParams, 'Invalid SQL query');
          }
          
          // Basic SQL injection prevention
          const forbiddenKeywords = ['DROP', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER'];
          const query = args.query.toUpperCase();
          if (forbiddenKeywords.some(keyword => query.includes(keyword))) {
            throw new McpError(ErrorCode.InvalidParams, 'Query contains forbidden operations');
          }

          // Use OpenAI to convert natural language to SQL
          const openAIResponse = await AIService.handleRequest('generate', { prompt: args.query });
          let sqlQuery: string = '';
          if (typeof openAIResponse === 'object' && openAIResponse && 'summary' in openAIResponse && typeof openAIResponse.summary === 'string') {
            sqlQuery = openAIResponse.summary;
          } else {
            throw new McpError(ErrorCode.InternalError, 'Failed to generate SQL query');
          }

          return this.withPgClient(async (client) => {
            const queryText = sqlQuery as string;
            try {
              const queryText = sqlQuery as string;
              const queryValues = (args.parameters || []) as string[];
              const result = await client.query(queryText, queryValues);
              return {
                content: [{
                  type: 'text',
                  text: JSON.stringify({
                    rows: result.rows,
                    rowCount: result.rowCount,
                    fields: result.fields.map((f: { name: string }) => f.name)
                  }, null, 2)
                }]
              };
            } catch (error) {
              throw new McpError(
                ErrorCode.InternalError,
                error instanceof Error ? error.message : 'SQL execution failed'
              );
            }
          });
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    });
  }

  async handleSqlAgentRequest(args: { query: string; parameters?: string[] }) {
    return this.withPgClient(async (client) => {
      try {
        const queryText = args.query as string;
        const queryValues = (args.parameters || []) as string[];
        const result = await client.query(queryText, queryValues);
        return {
          rows: result.rows,
          rowCount: result.rowCount,
          fields: result.fields.map((f: { name: string }) => f.name)
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'SQL execution failed'
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Supabase MCP server running on stdio');
  }
}

// Start the server if this file is executed directly
if (require.main === module) {
  const server = new SupabaseMcpServer();
  server.run().catch(console.error);
}

// Client CRUD operations
export async function getClients() {
  const supabase = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createClient(clientData: Database['public']['Tables']['clients']['Insert']) {
  const supabase = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();
}

export async function updateClient(id: string, clientData: Database['public']['Tables']['clients']['Update']) {
  const supabase = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return await supabase
    .from('clients')
    .delete()
    .eq('id', id);
}

export async function sqlAgent(args: { query: string; parameters?: string[] }) {
  const server = new SupabaseMcpServer();
  const openAIResponse = await AIService.handleRequest('generate', { prompt: args.query });
  let sqlQuery: string = '';
  if (typeof openAIResponse === 'object' && openAIResponse && 'summary' in openAIResponse && typeof openAIResponse.summary === 'string') {
    sqlQuery = openAIResponse.summary;
  } else {
    throw new McpError(ErrorCode.InternalError, 'Failed to generate SQL query');
  }
  const result = await server.handleSqlAgentRequest({ query: sqlQuery, parameters: args.parameters });
  return result;
}

export default SupabaseMcpServer;