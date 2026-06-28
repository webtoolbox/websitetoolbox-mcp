const BASE_URL = "https://api.websitetoolbox.com/v1";

export interface ApiClientOptions {
  apiKey: string;
  username?: string;
  email?: string;
}

export class ApiClient {
  private apiKey: string;
  private username?: string;
  private email?: string;

  constructor(options: ApiClientOptions) {
    this.apiKey = options.apiKey;
    this.username = options.username;
    this.email = options.email;
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.username) h["x-api-username"] = this.username;
    if (this.email) h["x-api-email"] = this.email;
    return h;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    queryParams?: Record<string, string>
  ): Promise<T> {
    let url = `${BASE_URL}${path}`;
    if (queryParams) {
      const qs = new URLSearchParams(queryParams).toString();
      if (qs) url += `?${qs}`;
    }
    const init: RequestInit = { method, headers: this.headers };
    if (body) init.body = JSON.stringify(body);
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  // ── Categories ──────────────────────────────────────────

  async listCategories(params?: {
    limit?: number;
    page?: number;
  }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/categories", undefined, qp);
  }

  async getCategory(categoryId: number) {
    return this.request("GET", `/api/categories/${categoryId}`);
  }

  async createCategory(data: {
    title: string;
    description?: string;
    unlisted?: boolean;
    locked?: boolean;
    password?: string;
    linked?: string;
    parentId?: number;
  }) {
    return this.request("POST", "/api/categories", data);
  }

  async updateCategory(
    categoryId: number,
    data: {
      title?: string;
      description?: string;
      unlisted?: boolean;
      locked?: boolean;
      password?: string;
      linked?: string;
      parentId?: number;
    }
  ) {
    return this.request("POST", `/api/categories/${categoryId}`, data);
  }

  async deleteCategory(categoryId: number) {
    return this.request("DELETE", `/api/categories/${categoryId}`);
  }

  // ── Category Permissions ────────────────────────────────

  async listCategoryPermissions(
    categoryId: number,
    params?: { limit?: number; page?: number }
  ) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request(
      "GET",
      `/api/categories/${categoryId}/permissions`,
      undefined,
      qp
    );
  }

  async updateCategoryPermission(
    categoryId: number,
    userGroupId: number,
    data: Record<string, boolean | undefined>
  ) {
    return this.request(
      "POST",
      `/api/categories/${categoryId}/permissions/${userGroupId}`,
      data
    );
  }

  // ── Topics ──────────────────────────────────────────────

  async listTopics(params?: {
    categoryId?: number;
    limit?: number;
    page?: number;
  }) {
    const qp: Record<string, string> = {};
    if (params?.categoryId) qp.categoryId = String(params.categoryId);
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/topics", undefined, qp);
  }

  async getTopic(topicId: number) {
    return this.request("GET", `/api/topics/${topicId}`);
  }

  async createTopic(data: {
    title: string;
    content: string;
    username: string;
    categoryId?: number;
  }) {
    return this.request("POST", "/api/topics", data);
  }

  async updateTopic(
    topicId: number,
    data: {
      title?: string;
      locked?: boolean;
      pinned?: boolean;
      categoryId?: number;
    }
  ) {
    return this.request("POST", `/api/topics/${topicId}`, data);
  }

  async deleteTopic(topicId: number) {
    return this.request("DELETE", `/api/topics/${topicId}`);
  }

  // ── Posts ───────────────────────────────────────────────

  async listPosts(params?: {
    topicId?: number;
    limit?: number;
    page?: number;
  }) {
    const qp: Record<string, string> = {};
    if (params?.topicId) qp.topicId = String(params.topicId);
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/posts", undefined, qp);
  }

  async getPost(postId: number) {
    return this.request("GET", `/api/posts/${postId}`);
  }

  async createPost(data: {
    content: string;
    username: string;
    topicId: number;
  }) {
    return this.request("POST", "/api/posts", data);
  }

  async updatePost(postId: number, data: { message?: string }) {
    return this.request("POST", `/api/posts/${postId}`, data);
  }

  async deletePost(postId: number) {
    return this.request("DELETE", `/api/posts/${postId}`);
  }

  // ── Users ───────────────────────────────────────────────

  async listUsers(params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/users", undefined, qp);
  }

  async getUser(userId: number) {
    return this.request("GET", `/api/users/${userId}`);
  }

  async createUser(data: {
    username: string;
    password: string;
    email: string;
    name?: string;
    userGroups?: number[];
    signature?: string;
  }) {
    return this.request("POST", "/api/users", data);
  }

  async updateUser(userId: number, data: Record<string, unknown>) {
    return this.request("POST", `/api/users/${userId}`, data);
  }

  async deleteUser(userId: number) {
    return this.request("DELETE", `/api/users/${userId}`);
  }

  // ── User Follow/Unfollow Topics ─────────────────────────

  async followTopics(userId: number, topicIds: number[]) {
    return this.request("POST", `/api/users/${userId}/followed_topics`, {
      topicIds,
    });
  }

  async unfollowTopics(userId: number, topicIds: number[]) {
    return this.request("DELETE", `/api/users/${userId}/followed_topics`, {
      topicIds,
    });
  }

  // ── User Groups ─────────────────────────────────────────

  async listUserGroups(params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/usergroups", undefined, qp);
  }

  async getUserGroup(usergroupId: number) {
    return this.request("GET", `/api/usergroups/${usergroupId}`);
  }

  async createUserGroup(data: {
    title: string;
    [key: string]: unknown;
  }) {
    return this.request("POST", "/api/usergroups", data);
  }

  async updateUserGroup(
    usergroupId: number,
    data: Record<string, unknown>
  ) {
    return this.request("POST", `/api/usergroups/${usergroupId}`, data);
  }

  async deleteUserGroup(usergroupId: number) {
    return this.request("DELETE", `/api/usergroups/${usergroupId}`);
  }

  async addUserToGroup(
    usergroupId: number,
    data: {
      userIds?: number[];
      usernames?: string[];
      emailAddresses?: string[];
    }
  ) {
    return this.request("POST", `/api/usergroups/${usergroupId}/users`, data);
  }

  async removeUserFromGroup(
    usergroupId: number,
    data: {
      userIds?: number[];
      usernames?: string[];
      emailAddresses?: string[];
    }
  ) {
    return this.request(
      "DELETE",
      `/api/usergroups/${usergroupId}/users`,
      data
    );
  }

  // ── Conversations ───────────────────────────────────────

  async listConversations(params?: { userId?: number; limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.userId) qp.userId = String(params.userId);
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/conversations", undefined, qp);
  }

  async getConversation(conversationId: number) {
    return this.request("GET", `/api/conversations/${conversationId}`);
  }

  async createConversation(data: {
    subject: string;
    message?: string;
    recipientUsernames?: string[];
    senderId?: number;
  }) {
    return this.request("POST", "/api/conversations", data);
  }

  async deleteConversation(conversationId: number) {
    return this.request("DELETE", `/api/conversations/${conversationId}`);
  }

  // ── Messages ────────────────────────────────────────────

  async listMessages(
    conversationId: number,
    params?: { limit?: number; page?: number }
  ) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request(
      "GET",
      `/api/conversations/${conversationId}/messages`,
      undefined,
      qp
    );
  }

  async getMessage(conversationId: number, messageId: number) {
    return this.request(
      "GET",
      `/api/conversations/${conversationId}/messages/${messageId}`
    );
  }

  async createMessage(
    conversationId: number,
    data: { message: string; userId?: number }
  ) {
    return this.request(
      "POST",
      `/api/conversations/${conversationId}/messages`,
      data
    );
  }

  // ── Moderators ──────────────────────────────────────────

  async listModerators(params?: {
    categoryId?: number;
    limit?: number;
    page?: number;
  }) {
    const qp: Record<string, string> = {};
    if (params?.categoryId) qp.categoryId = String(params.categoryId);
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/category_moderators", undefined, qp);
  }

  async getModerator(moderatorId: number) {
    return this.request("GET", `/api/category_moderators/${moderatorId}`);
  }

  async createModerator(data: {
    userId: number;
    categoryIds: number[];
    editPosts?: boolean;
    deletePosts?: boolean;
    movePosts?: boolean;
    approvePosts?: boolean;
    lockTopics?: boolean;
    pinTopics?: boolean;
    addPolls?: boolean;
    editPolls?: boolean;
    deletePolls?: boolean;
  }) {
    return this.request("POST", "/api/category_moderators", data);
  }

  async updateModerator(
    moderatorId: number,
    data: Record<string, boolean | undefined>
  ) {
    return this.request(
      "POST",
      `/api/category_moderators/${moderatorId}`,
      data
    );
  }

  async deleteModerator(moderatorId: number) {
    return this.request("DELETE", `/api/category_moderators/${moderatorId}`);
  }

  // ── Tags ────────────────────────────────────────────────

  async listTags(params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/tags", undefined, qp);
  }

  // ── Page Views ──────────────────────────────────────────

  async listPageViews(params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/page_views", undefined, qp);
  }

  // ── Notifications ───────────────────────────────────────

  async listNotifications(params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", "/api/notifications", undefined, qp);
  }

  // ── Post Edits ──────────────────────────────────────────

  async listPostEdits(postId: number, params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", `/api/posts/${postId}/edits`, undefined, qp);
  }

  // ── Topic Followers ─────────────────────────────────────

  async listTopicFollowers(topicId: number, params?: { limit?: number; page?: number }) {
    const qp: Record<string, string> = {};
    if (params?.limit) qp.limit = String(params.limit);
    if (params?.page) qp.page = String(params.page);
    return this.request("GET", `/api/topics/${topicId}/followers`, undefined, qp);
  }
}
