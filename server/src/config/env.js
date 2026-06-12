import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always load server/.env regardless of where npm was started from
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();

  if (
    !uri ||
    uri.includes('<db_password>') ||
    uri.includes('<password>') ||
    uri.includes('YOUR_PASSWORD') ||
    uri.includes(':PASSWORD@')
  ) {
    console.error(
      '\n❌ MONGODB_URI is missing or still has a placeholder password in server/.env\n' +
        '   Get your connection string from MongoDB Atlas → Connect → Drivers\n' +
        '   Replace <password> with your database user password (URL-encode special chars)\n' +
        '   Example: mongodb+srv://user:pass@cluster.mongodb.net/work4you?retryWrites=true&w=majority\n'
    );
    return null;
  }

  // Ensure a database name is in the URI (Atlas requires this for app data)
  if (uri.includes('mongodb+srv://') && !uri.match(/mongodb\+srv:\/\/[^/]+\/[^/?]/)) {
    return uri.replace(/(\.mongodb\.net)(\/?)(\?|$)/, '$1/work4you$3');
  }

  return uri;
}

export function validateSecurityConfig() {
  const secret = process.env.JWT_SECRET?.trim();
  const weakSecrets = [
    'your-super-secret-jwt-key-change-in-production',
    'secret',
    'changeme',
    'jwt-secret',
  ];

  if (!secret) {
    console.error(
      '\n❌ JWT_SECRET must be set in server/.env.\n' +
        '   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"\n'
    );
    return false;
  }

  if (secret.length < 32) {
    console.warn('\n⚠️  JWT_SECRET should be at least 32 characters for production use.\n');
  }

  if (weakSecrets.includes(secret.toLowerCase())) {
    console.warn('\n⚠️  JWT_SECRET is a known default — change it before deploying to production.\n');
  }

  return true;
}
