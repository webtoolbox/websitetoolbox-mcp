# Website Toolbox MCP

Chat with your forum using AI. The Website Toolbox MCP server lets you manage categories, topics, posts, users, and more through any MCP-compatible AI tool like [Claude Desktop](https://claude.ai), [Cursor](https://cursor.com), or [Hermes Agent](https://github.com/nousresearch/hermes-agent).

## Install in Claude Desktop

1. Open [Claude Desktop](https://claude.ai/download). If you don't have it, download it first.
2. [Download the .mcpb bundle](https://github.com/webtoolbox/websitetoolbox-mcp/releases/latest/download/websitetoolbox-mcp.mcpb).
3. In Claude Desktop, go to **Settings** (click your name at the bottom left, then the gear icon), then click **Extensions** in the left sidebar.
4. Click **Install from file** and select the downloaded `.mcpb` file.
5. When prompted, enter your forum's [API key](https://www.websitetoolbox.com/support/getting-your-api-key-252). You can find it in your forum's admin area under **Integrate → API**.
6. Start a new conversation and ask something about your forum!

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

---

## For developers

### Prerequisites

- Node.js ≥ 18

### Install

#### From npm

```bash
npm install -g websitetoolbox-mcp
```

#### From source

```bash
git clone https://github.com/webtoolbox/websitetoolbox-mcp
cd websitetoolbox-mcp
npm install
npm run build
```

### Configure

1. **Get your [API key](https://www.websitetoolbox.com/support/getting-your-api-key-252)** from your forum's **Integrate → API** settings.

2. **Set it as an environment variable:**

```bash
export WEBSITETOOLBOX_API_KEY="your-api-key"
```

   On **Windows**:

   ```cmd
   set WEBSITETOOLBOX_API_KEY=your-api-key
   ```

   Or create a `.env` file (copy `.env.example` to `.env` and fill in your key).

3. **Optional** — act as a specific user:

   ```bash
   export WEBSITETOOLBOX_USERNAME="admin"
   export WEBSITETOOLBOX_EMAIL="admin@example.com"
   ```

### Claude Desktop (manual config)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

### API Reference

This MCP server wraps the [Website Toolbox REST API](https://www.websitetoolbox.com/docs/api/). See the full API documentation at [https://www.websitetoolbox.com/docs/api/](https://www.websitetoolbox.com/docs/api/) or the [API Documentation](https://www.websitetoolbox.com/support/api-documentation-663) support article for details on authentication, endpoints, and rate limits.

## License

MIT
