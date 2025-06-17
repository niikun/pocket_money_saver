# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with memory limits
RUN npm ci --only=production --no-audit --no-fund --no-optional

# Copy source code
COPY . .

# Set environment variables for memory optimization
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=300"
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true

# Build the application
RUN npm run build

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/health || exit 1

# Start the application
CMD ["node", "server.js"]