module.exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    name: { type: "varchar(100)", notNull: true, default: "ユーザー" },
    email: { type: "varchar(255)", notNull: true, unique: true },
    // ★ 'password_hash' を 'password' に修正
    password: { type: "varchar(255)", notNull: true },
    role: { type: "varchar(50)", default: "user" },
    avatar_url: { type: "text" },
    is_active: { type: "boolean", default: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

// down関数も同様に修正
module.exports.down = (pgm) => {
  pgm.dropTable("users");
};
