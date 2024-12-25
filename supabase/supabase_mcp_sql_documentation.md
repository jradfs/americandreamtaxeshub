## Supabase Server MCP Tool - SQL Query Documentation

This document provides examples and guidelines for constructing SQL queries when using the `supabase-server` MCP tool.

### Basic Structure

To execute SQL queries using the `supabase-server` MCP tool, use the `query` tool with the following structure:

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "[Your SQL query here]"
    }
  </arguments>
</use_mcp_tool>
```

Replace `[Your SQL query here]` with the actual SQL query you want to execute.

### Examples

#### 1. Listing Tables

To get a list of all tables in the database:

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>list-tables</tool_name>
  <arguments>
    {}
  </arguments>
</use_mcp_tool>
```

#### 2. Describing a Table

To view the schema of a specific table (e.g., `clients`):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>describe-table</tool_name>
  <arguments>
    {
      "table_name": "clients"
    }
  </arguments>
</use_mcp_tool>
```

#### 3. Selecting All Data from a Table

To retrieve all columns and rows from a table (e.g., `clients`):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "SELECT * FROM clients;"
    }
  </arguments>
</use_mcp_tool>
```

#### 4. Selecting Specific Columns

To retrieve specific columns from a table (e.g., `full_name` and `contact_email` from `clients`):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "SELECT full_name, contact_email FROM clients;"
    }
  </arguments>
</use_mcp_tool>
```

#### 5. Filtering Data with WHERE Clause

To retrieve data that meets specific criteria (e.g., active clients):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "SELECT * FROM clients WHERE status = 'active';"
    }
  </arguments>
</use_mcp_tool>
```

#### 6. Inserting Data

To insert a new record into a table (e.g., into the `clients` table):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "INSERT INTO clients (full_name, contact_email, status) VALUES ('Jane Doe', 'jane.doe@example.com', 'pending');"
    }
  </arguments>
</use_mcp_tool>
```

**Note:** When inserting data, ensure that the column names and values match the table schema.

#### 7. Updating Data

To update existing records in a table (e.g., updating the status of a client):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "UPDATE clients SET status = 'active' WHERE contact_email = 'jane.doe@example.com';"
    }
  </arguments>
</use_mcp_tool>
```

#### 8. Deleting Data

To delete records from a table (e.g., deleting a client):

```xml
<use_mcp_tool>
  <server_name>supabase-server</server_name>
  <tool_name>query</tool_name>
  <arguments>
    {
      "sql": "DELETE FROM clients WHERE contact_email = 'jane.doe@example.com';"
    }
  </arguments>
</use_mcp_tool>
```

### Important Considerations

- **SQL Syntax:** Ensure your SQL queries are syntactically correct. Refer to the PostgreSQL documentation for detailed information on SQL syntax.
- **Permissions:** The `supabase-server` MCP tool operates with the permissions granted to the Supabase project. Ensure you have the necessary permissions to perform the desired operations.
- **Data Types:** When inserting or updating data, ensure that the data types match the column types defined in your Supabase schema.
- **Error Handling:** The MCP tool will return an error if the SQL query is invalid or if there are issues executing the query. Check the response for error messages.