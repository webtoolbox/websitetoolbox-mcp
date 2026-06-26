# Website Toolbox MCP

Model Context Protocol server for the [Website Toolbox](https://www.websitetoolbox.com) forum platform. Exposes the Forum REST API as MCP tools that any MCP-compatible client (Claude Desktop, Cursor, etc.) can use.

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
- A Website Toolbox API key (get one from your forum's **Integrate → API** settings)

## Install

```bash
npm install
npm run build
```

## Configure

Set environment variables:

```bash
export WEBSITETOOLBOX_API_KEY="your-api-key"

# Optional — act as a specific user
export WEBSITETOOLBOX_USERNAME="admin"
export WEBSITETOOLBOX_EMAIL="admin@example.com"
```

Or use a `.env` file (copy `.env.example` to `.env` and fill in your key).

## Usage

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "websitetoolbox": {
      "command": "node",
      "args": ["/absolute/path/to/websitetoolbox-mcp/dist/index.js"],
      "env": {
        "WEBSITETOOLBOX_API_KEY": "your-api-key"
      }
    }
  }
}
```

### With other MCP clients

Run the server on stdio:

```bash
node dist/index.js
```

## API Reference

This MCP server wraps the [Website Toolbox REST API](https://api.websitetoolbox.com). See the full API documentation at [docs/api/index.html.md](https://github.com/webtoolbox/Website-Toolbox/blob/main/docs/api/index.html.md) in the main Website Toolbox repo.

## License

MIT
