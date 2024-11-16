# Step 1: ใช้ official Node.js image เป็น base image
FROM node:18 AS builder

# Step 2: ตั้งค่า working directory
WORKDIR /app

# Step 3: Copy ไฟล์ที่จำเป็น
COPY package*.json ./

# Step 4: ติดตั้ง dependencies
RUN npm install

# Step 5: Copy โค้ดทั้งหมดของโปรเจกต์
COPY . .

# Step 6: Build แอปพลิเคชัน Next.js เป็น production-ready
RUN npm run build

# Step 7: ใช้ base image ใหม่สำหรับ production เพื่อลดขนาด
FROM node:18-slim

# Step 8: ตั้งค่า working directory ใน production
WORKDIR /app

# Step 9: Copy node_modules และ .next จาก builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

# Step 10: ตั้งค่าให้ expose port 3000
EXPOSE 3000

# Step 11: Run แอปใน production mode
CMD ["npm", "run", "start"]
