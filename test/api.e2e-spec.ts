import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';

describe('API Integration Tests (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api (GET)', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('NestJS CRUD API is running!');
    });

    it('/api/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
        });
    });
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    describe('/api/auth/register (POST)', () => {
      it('should register a new user successfully', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send(testUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.username).toBe(testUser.username);
            expect(res.body.user).not.toHaveProperty('password');
            
            // Store for later tests
            accessToken = res.body.access_token;
            userId = res.body.user.id;
          });
      });

      it('should fail with duplicate email', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send(testUser)
          .expect(409);
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ ...testUser, email: 'invalid-email' })
          .expect(400);
      });

      it('should fail with short password', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ ...testUser, email: 'new@example.com', password: '123' })
          .expect(400);
      });
    });

    describe('/api/auth/login (POST)', () => {
      it('should login successfully', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.email).toBe(testUser.email);
          });
      });

      it('should fail with wrong password', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should fail with non-existent email', () => {
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testUser.password,
          })
          .expect(401);
      });
    });

    describe('/api/auth/profile (GET)', () => {
      it('should get user profile', () => {
        return request(app.getHttpServer())
          .get('/api/auth/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toBe(testUser.email);
            expect(res.body.username).toBe(testUser.username);
            expect(res.body).not.toHaveProperty('password');
          });
      });

      it('should fail without token', () => {
        return request(app.getHttpServer())
          .get('/api/auth/profile')
          .expect(401);
      });

      it('should fail with invalid token', () => {
        return request(app.getHttpServer())
          .get('/api/auth/profile')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });
  });

  describe('Users CRUD', () => {
    describe('/api/users (GET)', () => {
      it('should get all users', () => {
        return request(app.getHttpServer())
          .get('/api/users')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .get('/api/users')
          .expect(401);
      });
    });

    describe('/api/users/:id (GET)', () => {
      it('should get user by id', () => {
        return request(app.getHttpServer())
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(userId);
            expect(res.body).not.toHaveProperty('password');
          });
      });

      it('should fail for non-existent user', () => {
        return request(app.getHttpServer())
          .get('/api/users/99999')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });

    describe('/api/users/:id (PATCH)', () => {
      it('should update user', () => {
        const updateData = {
          firstName: 'Updated',
          lastName: 'Name',
        };

        return request(app.getHttpServer())
          .patch(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body.firstName).toBe(updateData.firstName);
            expect(res.body.lastName).toBe(updateData.lastName);
          });
      });
    });
  });

  describe('Posts CRUD', () => {
    const testPost = {
      title: 'Test Post',
      content: 'This is a test post content.',
    };

    describe('/api/posts (POST)', () => {
      it('should create a new post', () => {
        return request(app.getHttpServer())
          .post('/api/posts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(testPost)
          .expect(201)
          .expect((res) => {
            expect(res.body.title).toBe(testPost.title);
            expect(res.body.content).toBe(testPost.content);
            expect(res.body.authorId).toBe(userId);
            
            // Store for later tests
            postId = res.body.id;
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post('/api/posts')
          .send(testPost)
          .expect(401);
      });

      it('should fail with invalid data', () => {
        return request(app.getHttpServer())
          .post('/api/posts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ title: '' })
          .expect(400);
      });
    });

    describe('/api/posts (GET)', () => {
      it('should get all posts', () => {
        return request(app.getHttpServer())
          .get('/api/posts')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            
            const post = res.body.find(p => p.id === postId);
            expect(post).toBeDefined();
            expect(post.author).toBeDefined();
            expect(post.author.username).toBe('testuser');
          });
      });
    });

    describe('/api/posts/:id (GET)', () => {
      it('should get post by id', () => {
        return request(app.getHttpServer())
          .get(`/api/posts/${postId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(postId);
            expect(res.body.title).toBe(testPost.title);
            expect(res.body.author).toBeDefined();
          });
      });

      it('should fail for non-existent post', () => {
        return request(app.getHttpServer())
          .get('/api/posts/99999')
          .expect(404);
      });
    });

    describe('/api/posts/:id (PATCH)', () => {
      it('should update own post', () => {
        const updateData = {
          title: 'Updated Post Title',
          content: 'Updated content',
        };

        return request(app.getHttpServer())
          .patch(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).toBe(updateData.title);
            expect(res.body.content).toBe(updateData.content);
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .patch(`/api/posts/${postId}`)
          .send({ title: 'Unauthorized Update' })
          .expect(401);
      });
    });

    describe('/api/posts/:id (DELETE)', () => {
      it('should delete own post', () => {
        return request(app.getHttpServer())
          .delete(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });

      it('should fail to get deleted post', () => {
        return request(app.getHttpServer())
          .get(`/api/posts/${postId}`)
          .expect(404);
      });
    });
  });
});