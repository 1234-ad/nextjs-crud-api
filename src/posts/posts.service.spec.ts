import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    authorId: 1,
    author: {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createPostDto: CreatePostDto = {
      title: 'Test Post',
      content: 'Test content',
    };

    it('should create a new post successfully', async () => {
      mockRepository.create.mockReturnValue(mockPost);
      mockRepository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, 1);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        authorId: 1,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [mockPost];
      mockRepository.find.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['author'],
        select: {
          author: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      });
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author'],
        select: {
          author: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByAuthor', () => {
    it('should return posts by author', async () => {
      const posts = [mockPost];
      mockRepository.find.mockResolvedValue(posts);

      const result = await service.findByAuthor(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { authorId: 1 },
        relations: ['author'],
        select: {
          author: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      });
      expect(result).toEqual(posts);
    });
  });

  describe('update', () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post',
      content: 'Updated content',
    };

    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, ...updatePostDto };
      mockRepository.findOne.mockResolvedValueOnce(mockPost).mockResolvedValueOnce(updatedPost);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updatePostDto, 1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updatePostDto);
      expect(result).toEqual(updatedPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updatePostDto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.update(1, updatePostDto, 2)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a post successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      mockRepository.remove.mockResolvedValue(mockPost);

      await service.remove(1, 1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.remove(1, 2)).rejects.toThrow(ForbiddenException);
    });
  });
});