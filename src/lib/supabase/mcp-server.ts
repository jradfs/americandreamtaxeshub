import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
const { Pool } = pg;
import type { Database } from '../../types/database.types';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;
const DATABASE_URL = process.env.DATABASE_URL as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !DATABASE_URL) {
  throw new Error('Supabase credentials must be set in environment variables');
}

class SupabaseMcpServer {
  private server: Server;
  private supabaseClient: ReturnType<typeof createClient<Database>>;
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

    this.supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
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

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
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

export default SupabaseMcpServer;