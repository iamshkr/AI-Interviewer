/**@type {import("drizzle-kit").Config} */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_AsrOXT82jcbp@ep-plain-cloud-ad206w5u.c-2.us-east-1.aws.neon.tech/ai_interviewer?sslmode=require&channel_binding=require',
  }
};