# Website Toolbox MCP

Model Context Protocol server for the [Website Toolbox](https://www.websitetoolbox.com) community forum platform. Exposes the Forum REST API as MCP tools that any MCP-compatible client (Claude Desktop, Cursor, Hermes Agent, etc.) can use to manage your community forum.

## Features

| Resource | Tools |
|---|---|
| **Categories** | list, get, create, update, delete, list permissions, update permissions |
| **Topics** | list, get, create, update, delete |
| **Posts** | list, get, create, update, delete |
| **Users** | list, get, create, update, delete, follow topics, unfollow topics |
| **User Groups** | list, get, create, update, delete, add users, remove users |
| **Conversations** | list, get, create, delete |
| **Messages** | list, get, create |
| **Moderators** | list, get, create, update, delete |
| **Tags** | list |
| **Page Views** | list |

## Prerequisites

- Node.js ≥ 18

## Install

### From npm (recommended)

```bash
npm install -g websitetoolbox-mcp
```

### From source

```bash
git clone https://github.com/webtoolbox/websitetoolbox-mcp
cd websitetoolbox-mcp
npm install
npm run build
```

## Configure

1. **Get your [API key](https://www.websitetoolbox.com/support/getting-your-api-key-252)** from your forum's **Integrate → API** settings.

2. **Set it as an environment variable:**

```bash
export WEBSITETOOLBOX_API_KEY="your-api-key"
```

   On **Windows**:

   ```cmd
   set WEBSITETOOLBOX_API_KEY=***   ```

   Or create a `.env` file (copy `.env.example` to `.env` and fill in your key).

3. **Optional** — act as a specific user:

   ```bash
   export WEBSITETOOLBOX_USERNAME="admin"
   export WEBSITETOOLBOX_EMAIL="admin@example.com"
   ```

## Usage

This server works with any tool that supports MCP, such as Claude Desktop and Hermes Agent.

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`). If installed globally via npm:

```json
{
  "mcpServers": {
    "websitetoolbox": {
      "command": "npx",
      "args": ["websitetoolbox-mcp"],
      "env": {
        "WEBSITETOOLBOX_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Other MCP clients

Run the server on stdio:

```bash
npx websitetoolbox-mcp
```

## API Reference

This MCP server wraps the [Website Toolbox REST API](https://www.websitetoolbox.com/docs/api/). See the full API documentation at [https://www.websitetoolbox.com/docs/api/](https://www.websitetoolbox.com/docs/api/) or the [API Documentation](https://www.websitetoolbox.com/support/api-documentation-663) support article for details on authentication, endpoints, and rate limits.

## License

MIT
