// backend/utils/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();


const serviceAccount = {
 "type": "service_account",
  "project_id": "ai--study-planner",
  "private_key_id": "e85bbd75825b8b2e35fb2b99064efc493d0cfa7d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGmER3lyKzasOw\naf8ENJfkk92odF+IzuAVQ+7XktFQ9X7t0Uhf9uXiNOtb4rikZtc6n3pSPIaiSpN2\nKISj96NIOaI10hv+hrA1O5Wy/KJ/epjMRqp2uJzGFTXeUh1b7EqyMmk0QM/c5J+q\nFZ3eia+1zgRgAslJ4Aa1xH+ZcM8fX8l0g1zkOuI9/tmAhS3vLMW7/Hg0MiGWOK0I\nxWa9pO3d/hJtwT9LgAC4m8BJVyQbVYKa3jRWJcT1GLllPRKt8ZNigMx8fWH3Ebfi\n8frJkWMkCt4Kwzwk27VXM352U0O1htrYzAI9Xbg1ji6hxkSEgQpfrhD1P/vtN03Y\nUfcq9UEVAgMBAAECggEAEoYndMQ7L2MZB76LU/gX5vFH7quUMa2iRzmD8MW4EoYj\npcksqA7emH/5KCP4txUEpGo1va/5mu+723yiCq1RpK4DjGOhytcDXqPFLeHUwnFM\nCVnaEqLbtLpLwQYFyQo8WWzMVVxqRx9oKTRE+nn7Usj5rX71CZgE6DWA9W4JU9Kw\nRFNTtx5yDolRzx1gEl4fMDimXLFJ4hYUbMgdjFZMRKWJL5NqyAKw+Q71ihzht7HA\nCx2z5OzVVqq29bRQZih6jIU/3qvEFCbvhrNGKG8X9febRj91T0rZ5XR6dm1TeU35\nkuvwG/BPScSQLFc+w7pblBS2raMkhA5kgu2ZTDQmzQKBgQD0LJs6Q2X7+X9vZNyP\nyXqt51BsOxQTXtSJ/Kan1lgr8n8N7NliB6ZCz2e5zPUJRe5EFGdJ4fdUvFGiolt8\nkNY4/iRJvjAbSSmoNNmBCV+JG2nVTjJIa8tr7quLSL8PFm8xsP3poR+KmNtthHuQ\nDmX2hSZPkYrRpxojsalOslzm8wKBgQDQNotftaNkclacYqJUCLVApbvPcfMwtUci\nzUfQbnJL87ZjJJ+RZ/iwutjftDBcY++xkdL2knh3sm5SwTyKfmT8oJcfnx43OtNC\n6XynU4LJB1lUNO9HnWrcYxz0hag6NOm5yQ5Ae7pg84R7TtDgpMtpr2I+K87fLak5\nARb0h5xJ1wKBgDNtLahgx5sBWmiwuo+CJNd5r4OMEddekq8ZSlRxHZLr+PyK1OID\nsG3D1xnX5Af29Y7bKUHzWK89FoiFX3Vl3+iTBjuN1f35M8/cia7WtYtf/bNSS97a\n7TYnR3QHd04LMJIrr97D86uyNAzl6UxW6/y24HHDupQbeLLp2Tnc8RonAoGAD7d+\nT8wzODrVRNrBLBy4KdgY1DDizZNxejQKrrYXlJoh81vpW52AjT6dbk14tRCqIDpE\ntW4a/9YNM9v4SO//iX5Jyg5Fxp9/IPbk/PB119zhJlUUltBQJ7Cnl+Ga8EHcPrTp\niX6NdBINtw0dAUgPPrwJa239IKWet3nYlL7D0mMCgYAXSjeVcSWZ7cZ8bVotfneY\nCA7hKaJP2ddSp3BRar2q9NzHkr1JAGG80kwkkuZYc/WzvnJLSacwa11O5eEKgpU9\ntW8CuiPYenuOoBfP5qyDWlLKmJb844B7NLaSRdheE/wxaP+zFESSd4En4958maIP\nzo5YArgmlYsReWcK9h6hOg==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-phsw8@ai--study-planner.iam.gserviceaccount.com",
  "client_id": "117048726216228052200",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-phsw8%40ai--study-planner.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
