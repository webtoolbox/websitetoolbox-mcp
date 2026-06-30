#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ApiClient } from "./client.js";

const API_KEY = process.env.WEBSITETOOLBOX_API_KEY;
if (!API_KEY) {
  console.error("WEBSITETOOLBOX_API_KEY environment variable is required");
  process.exit(1);
}

const client = new ApiClient({
  apiKey: API_KEY,
  username: process.env.WEBSITETOOLBOX_USERNAME,
  email: process.env.WEBSITETOOLBOX_EMAIL,
});

const server = new McpServer({
  name: "websitetoolbox-mcp",
  version: "1.1.0",
});

// ── Categories ──────────────────────────────────────────

server.tool("list_categories", "List all forum categories", {
  limit: z.number().optional().describe("Max categories to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Categories", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listCategories({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_category", "Get a single category by ID", {
  categoryId: z.number().describe("The category ID"),
}, { title: "Get Category", readOnlyHint: true }, async ({ categoryId }) => {
  const data = await client.getCategory(categoryId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_category", "Create a new forum category", {
  title: z.string().describe("Category name"),
  description: z.string().optional().describe("Category description"),
  unlisted: z.boolean().optional().describe("Hide from category listing"),
  locked: z.boolean().optional().describe("Prevent new posts"),
  password: z.string().optional().describe("Password protect the category"),
  linked: z.string().optional().describe("URL to link to instead"),
  parentId: z.number().optional().describe("Parent category ID"),
}, { title: "Create Category", destructiveHint: true }, async (params) => {
  const data = await client.createCategory(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_category", "Update an existing category", {
  categoryId: z.number().describe("The category ID"),
  title: z.string().optional().describe("New category name"),
  description: z.string().optional().describe("New description"),
  unlisted: z.boolean().optional().describe("Hide from listing"),
  locked: z.boolean().optional().describe("Prevent new posts"),
  password: z.string().optional().describe("Password protect"),
  linked: z.string().optional().describe("Link URL"),
  parentId: z.number().optional().describe("Parent category ID"),
}, { title: "Update Category", destructiveHint: true }, async ({ categoryId, ...rest }) => {
  const data = await client.updateCategory(categoryId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_category", "Delete a category (permanent, cascades to topics/posts)", {
  categoryId: z.number().describe("The category ID"),
}, { title: "Delete Category", destructiveHint: true }, async ({ categoryId }) => {
  const data = await client.deleteCategory(categoryId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("list_category_permissions", "List user group permissions for a category", {
  categoryId: z.number().describe("The category ID"),
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Category Permissions", readOnlyHint: true }, async ({ categoryId, limit, page }) => {
  const data = await client.listCategoryPermissions(categoryId, { limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_category_permission", "Update a user group's permissions for a category", {
  categoryId: z.number().describe("The category ID"),
  userGroupId: z.number().describe("The user group ID"),
  viewCategory: z.boolean().optional().describe("Can view category"),
  viewOthersTopics: z.boolean().optional().describe("Can view others' topics"),
  startTopics: z.boolean().optional().describe("Can create topics"),
  replyTopics: z.boolean().optional().describe("Can reply to topics"),
  viewAttachments: z.boolean().optional().describe("Can view attachments"),
  uploadAttachments: z.boolean().optional().describe("Can upload attachments"),
  requirePostApproval: z.boolean().optional().describe("Require post approval"),
}, { title: "Update Category Permission", destructiveHint: true }, async ({ categoryId, userGroupId, ...perms }) => {
  const data = await client.updateCategoryPermission(categoryId, userGroupId, perms);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Topics ──────────────────────────────────────────────

server.tool("list_topics", "List topics (optionally filtered by category)", {
  categoryId: z.number().optional().describe("Filter by category ID"),
  limit: z.number().optional().describe("Max topics to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Topics", readOnlyHint: true }, async ({ categoryId, limit, page }) => {
  const data = await client.listTopics({ categoryId, limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_topic", "Get a single topic by ID", {
  topicId: z.number().describe("The topic ID"),
}, { title: "Get Topic", readOnlyHint: true }, async ({ topicId }) => {
  const data = await client.getTopic(topicId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_topic", "Create a new topic with an initial post", {
  title: z.string().describe("Topic title"),
  content: z.string().describe("Initial post content (HTML allowed)"),
  username: z.string().describe("Username of the author"),
  categoryId: z.number().optional().describe("Category to post in"),
}, { title: "Create Topic", destructiveHint: true }, async (params) => {
  const data = await client.createTopic(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_topic", "Update a topic's properties", {
  topicId: z.number().describe("The topic ID"),
  title: z.string().optional().describe("New title"),
  locked: z.boolean().optional().describe("Lock/unlock the topic"),
  pinned: z.boolean().optional().describe("Pin/unpin the topic"),
  categoryId: z.number().optional().describe("Move to another category"),
}, { title: "Update Topic", destructiveHint: true }, async ({ topicId, ...rest }) => {
  const data = await client.updateTopic(topicId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_topic", "Delete a topic (permanent, cascades to posts)", {
  topicId: z.number().describe("The topic ID"),
}, { title: "Delete Topic", destructiveHint: true }, async ({ topicId }) => {
  const data = await client.deleteTopic(topicId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Posts ───────────────────────────────────────────────

server.tool("list_posts", "List posts (optionally filtered by topic)", {
  topicId: z.number().optional().describe("Filter by topic ID"),
  limit: z.number().optional().describe("Max posts to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Posts", readOnlyHint: true }, async ({ topicId, limit, page }) => {
  const data = await client.listPosts({ topicId, limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_post", "Get a single post by ID", {
  postId: z.number().describe("The post ID"),
}, { title: "Get Post", readOnlyHint: true }, async ({ postId }) => {
  const data = await client.getPost(postId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_post", "Create a new post (reply) in a topic", {
  content: z.string().describe("Post content (HTML allowed)"),
  username: z.string().describe("Username of the author"),
  topicId: z.number().describe("Topic to post in"),
}, { title: "Create Post", destructiveHint: true }, async (params) => {
  const data = await client.createPost(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_post", "Update a post's content", {
  postId: z.number().describe("The post ID"),
  message: z.string().describe("New post content"),
}, { title: "Update Post", destructiveHint: true }, async ({ postId, message }) => {
  const data = await client.updatePost(postId, { message });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_post", "Delete a post (permanent)", {
  postId: z.number().describe("The post ID"),
}, { title: "Delete Post", destructiveHint: true }, async ({ postId }) => {
  const data = await client.deletePost(postId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Users ───────────────────────────────────────────────

server.tool("list_users", "List forum users", {
  limit: z.number().optional().describe("Max users to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Users", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listUsers({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_user", "Get a single user by ID", {
  userId: z.number().describe("The user ID"),
}, { title: "Get User", readOnlyHint: true }, async ({ userId }) => {
  const data = await client.getUser(userId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_user", "Create a new forum user", {
  username: z.string().describe("Username"),
  password: z.string().describe("Password"),
  email: z.string().describe("Email address"),
  name: z.string().optional().describe("Display name"),
  userGroups: z.array(z.number()).optional().describe("User group IDs"),
  signature: z.string().optional().describe("User signature"),
}, { title: "Create User", destructiveHint: true }, async (params) => {
  const data = await client.createUser(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_user", "Update a user's profile or settings", {
  userId: z.number().describe("The user ID"),
  username: z.string().optional().describe("New username"),
  password: z.string().optional().describe("New password"),
  email: z.string().optional().describe("New email"),
  name: z.string().optional().describe("New display name"),
  signature: z.string().optional().describe("New signature"),
  userGroups: z.array(z.number()).optional().describe("User group IDs"),
  allowEmails: z.boolean().optional().describe("Allow other members to email"),
  offline: z.boolean().optional().describe("Hide online status"),
  enableMessages: z.boolean().optional().describe("Allow sending messages"),
  userTitle: z.string().optional().describe("Custom user title"),
  avatarUrl: z.string().optional().describe("Avatar image URL"),
}, { title: "Update User", destructiveHint: true }, async ({ userId, ...rest }) => {
  const data = await client.updateUser(userId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_user", "Delete a user (permanent)", {
  userId: z.number().describe("The user ID"),
}, { title: "Delete User", destructiveHint: true }, async ({ userId }) => {
  const data = await client.deleteUser(userId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("follow_topics", "Make a user follow specific topics", {
  userId: z.number().describe("The user ID"),
  topicIds: z.array(z.number()).describe("Topic IDs to follow"),
}, { title: "Follow Topics", destructiveHint: true }, async ({ userId, topicIds }) => {
  const data = await client.followTopics(userId, topicIds);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("unfollow_topics", "Make a user unfollow specific topics", {
  userId: z.number().describe("The user ID"),
  topicIds: z.array(z.number()).describe("Topic IDs to unfollow"),
}, { title: "Unfollow Topics", destructiveHint: true }, async ({ userId, topicIds }) => {
  const data = await client.unfollowTopics(userId, topicIds);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── User Groups ─────────────────────────────────────────

server.tool("list_user_groups", "List all user groups", {
  limit: z.number().optional().describe("Max groups to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List User Groups", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listUserGroups({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_user_group", "Get a single user group by ID", {
  usergroupId: z.number().describe("The user group ID"),
}, { title: "Get User Group", readOnlyHint: true }, async ({ usergroupId }) => {
  const data = await client.getUserGroup(usergroupId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_user_group", "Create a new user group with permissions", {
  title: z.string().describe("Group name"),
  viewForum: z.boolean().optional().describe("Can view forum"),
  startTopics: z.boolean().optional().describe("Can start topics"),
  replyTopics: z.boolean().optional().describe("Can reply to topics"),
  editOwnPosts: z.boolean().optional().describe("Can edit own posts"),
  deleteOwnPosts: z.boolean().optional().describe("Can delete own posts"),
  uploadAttachments: z.boolean().optional().describe("Can upload attachments"),
  viewProfiles: z.boolean().optional().describe("Can view profiles"),
  postEvents: z.boolean().optional().describe("Can post events"),
  postPolls: z.boolean().optional().describe("Can post polls"),
  voteOnPolls: z.boolean().optional().describe("Can vote on polls"),
}, { title: "Create User Group", destructiveHint: true }, async (params) => {
  const data = await client.createUserGroup(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_user_group", "Update a user group's settings or permissions", {
  usergroupId: z.number().describe("The user group ID"),
  title: z.string().optional().describe("New group name"),
  viewForum: z.boolean().optional().describe("Can view forum"),
  startTopics: z.boolean().optional().describe("Can start topics"),
  replyTopics: z.boolean().optional().describe("Can reply to topics"),
  editOwnPosts: z.boolean().optional().describe("Can edit own posts"),
  deleteOwnPosts: z.boolean().optional().describe("Can delete own posts"),
  uploadAttachments: z.boolean().optional().describe("Can upload attachments"),
  viewProfiles: z.boolean().optional().describe("Can view profiles"),
  postEvents: z.boolean().optional().describe("Can post events"),
  postPolls: z.boolean().optional().describe("Can post polls"),
  voteOnPolls: z.boolean().optional().describe("Can vote on polls"),
}, { title: "Update User Group", destructiveHint: true }, async ({ usergroupId, ...rest }) => {
  const data = await client.updateUserGroup(usergroupId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_user_group", "Delete a user group (permanent)", {
  usergroupId: z.number().describe("The user group ID"),
}, { title: "Delete User Group", destructiveHint: true }, async ({ usergroupId }) => {
  const data = await client.deleteUserGroup(usergroupId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("add_users_to_group", "Add users to a user group", {
  usergroupId: z.number().describe("The user group ID"),
  userIds: z.array(z.number()).optional().describe("User IDs to add"),
  usernames: z.array(z.string()).optional().describe("Usernames to add"),
  emailAddresses: z.array(z.string()).optional().describe("Emails to add"),
}, { title: "Add Users to Group", destructiveHint: true }, async ({ usergroupId, ...rest }) => {
  const data = await client.addUserToGroup(usergroupId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("remove_users_from_group", "Remove users from a user group", {
  usergroupId: z.number().describe("The user group ID"),
  userIds: z.array(z.number()).optional().describe("User IDs to remove"),
  usernames: z.array(z.string()).optional().describe("Usernames to remove"),
  emailAddresses: z.array(z.string()).optional().describe("Emails to remove"),
}, { title: "Remove Users from Group", destructiveHint: true }, async ({ usergroupId, ...rest }) => {
  const data = await client.removeUserFromGroup(usergroupId, rest);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Conversations ───────────────────────────────────────

server.tool("list_conversations", "List private conversations", {
  userId: z.number().describe("User ID (required)"),
  limit: z.number().optional().describe("Max conversations to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Conversations", readOnlyHint: true }, async ({ userId, limit, page }) => {
  const data = await client.listConversations({ userId, limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_conversation", "Get a single conversation by ID", {
  conversationId: z.number().describe("The conversation ID"),
}, { title: "Get Conversation", readOnlyHint: true }, async ({ conversationId }) => {
  const data = await client.getConversation(conversationId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_conversation", "Start a new private conversation", {
  subject: z.string().describe("Conversation subject"),
  message: z.string().optional().describe("Initial message"),
  recipientUsernames: z.array(z.string()).optional().describe("Recipient usernames"),
  senderId: z.number().optional().describe("Sender user ID"),
}, { title: "Create Conversation", destructiveHint: true }, async (params) => {
  const data = await client.createConversation(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_conversation", "Delete a conversation (permanent)", {
  conversationId: z.number().describe("The conversation ID"),
}, { title: "Delete Conversation", destructiveHint: true }, async ({ conversationId }) => {
  const data = await client.deleteConversation(conversationId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Messages ────────────────────────────────────────────

server.tool("list_messages", "List messages in a conversation", {
  conversationId: z.number().describe("The conversation ID"),
  limit: z.number().optional().describe("Max messages to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Messages", readOnlyHint: true }, async ({ conversationId, limit, page }) => {
  const data = await client.listMessages(conversationId, { limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_message", "Get a single message by ID", {
  conversationId: z.number().describe("The conversation ID"),
  messageId: z.number().describe("The message ID"),
}, { title: "Get Message", readOnlyHint: true }, async ({ conversationId, messageId }) => {
  const data = await client.getMessage(conversationId, messageId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_message", "Send a message in a conversation", {
  conversationId: z.number().describe("The conversation ID"),
  message: z.string().describe("Message content"),
  userId: z.number().optional().describe("Sender user ID"),
}, { title: "Send Message", destructiveHint: true }, async ({ conversationId, message, userId }) => {
  const data = await client.createMessage(conversationId, { message, userId });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Moderators ──────────────────────────────────────────

server.tool("list_moderators", "List all category moderators", {
  categoryId: z.number().optional().describe("Filter by category ID"),
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Moderators", readOnlyHint: true }, async ({ categoryId, limit, page }) => {
  const data = await client.listModerators({ categoryId, limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get_moderator", "Get a single moderator by ID", {
  moderatorId: z.number().describe("The moderator ID"),
}, { title: "Get Moderator", readOnlyHint: true }, async ({ moderatorId }) => {
  const data = await client.getModerator(moderatorId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("create_moderator", "Assign a user as moderator for categories", {
  userId: z.number().describe("User ID to make moderator"),
  categoryIds: z.array(z.number()).describe("Category IDs to moderate"),
  editPosts: z.boolean().optional().describe("Can edit posts"),
  deletePosts: z.boolean().optional().describe("Can delete posts"),
  movePosts: z.boolean().optional().describe("Can move posts"),
  approvePosts: z.boolean().optional().describe("Can approve posts"),
  lockTopics: z.boolean().optional().describe("Can lock topics"),
  pinTopics: z.boolean().optional().describe("Can pin topics"),
  addPolls: z.boolean().optional().describe("Can add polls"),
  editPolls: z.boolean().optional().describe("Can edit polls"),
  deletePolls: z.boolean().optional().describe("Can delete polls"),
}, { title: "Create Moderator", destructiveHint: true }, async (params) => {
  const data = await client.createModerator(params);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("update_moderator", "Update a moderator's permissions", {
  moderatorId: z.number().describe("The moderator ID"),
  editPosts: z.boolean().optional().describe("Can edit posts"),
  deletePosts: z.boolean().optional().describe("Can delete posts"),
  movePosts: z.boolean().optional().describe("Can move posts"),
  approvePosts: z.boolean().optional().describe("Can approve posts"),
  lockTopics: z.boolean().optional().describe("Can lock topics"),
  pinTopics: z.boolean().optional().describe("Can pin topics"),
  addPolls: z.boolean().optional().describe("Can add polls"),
  editPolls: z.boolean().optional().describe("Can edit polls"),
  deletePolls: z.boolean().optional().describe("Can delete polls"),
}, { title: "Update Moderator", destructiveHint: true }, async ({ moderatorId, ...perms }) => {
  const data = await client.updateModerator(moderatorId, perms);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("delete_moderator", "Remove a moderator", {
  moderatorId: z.number().describe("The moderator ID"),
}, { title: "Delete Moderator", destructiveHint: true }, async ({ moderatorId }) => {
  const data = await client.deleteModerator(moderatorId);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Tags ────────────────────────────────────────────────

server.tool("list_tags", "List all forum tags", {
  limit: z.number().optional().describe("Max tags to return (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Tags", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listTags({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Page Views ──────────────────────────────────────────

server.tool("list_page_views", "List forum page view analytics", {
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Page Views", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listPageViews({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Notifications ───────────────────────────────────────

server.tool("list_notifications", "List notifications for the authenticated user", {
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Notifications", readOnlyHint: true }, async ({ limit, page }) => {
  const data = await client.listNotifications({ limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Post Edits ──────────────────────────────────────────

server.tool("list_post_edits", "List edit history for a post", {
  postId: z.number().describe("The post ID"),
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Post Edits", readOnlyHint: true }, async ({ postId, limit, page }) => {
  const data = await client.listPostEdits(postId, { limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Topic Followers ─────────────────────────────────────

server.tool("list_topic_followers", "List users following a topic (admin/moderator only)", {
  topicId: z.number().describe("The topic ID"),
  limit: z.number().optional().describe("Max results (1–100)"),
  page: z.number().optional().describe("Page number"),
}, { title: "List Topic Followers", readOnlyHint: true }, async ({ topicId, limit, page }) => {
  const data = await client.listTopicFollowers(topicId, { limit, page });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Start ───────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("websitetoolbox-mcp server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
