# MongoDB Setup Instructions

## Option 1: Install MongoDB locally

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service: `net start MongoDB`
4. Or run manually: `mongod --dbpath "C:\data\db"`

### Mac:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

## Option 2: Use MongoDB Atlas (Cloud)

1. Go to: https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster (free tier)
4. Get connection string
5. Update .env file:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/Artisan-Alloy?retryWrites=true&w=majority
```

## Option 3: Quick Test with Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## After MongoDB is running:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Test signup at: http://localhost:5174/register

The signup should work once MongoDB is running!