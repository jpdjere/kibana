/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCurrentConversation, Props } from '.';
import { useConversation } from '../use_conversation';
import deepEqual from 'fast-deep-equal';
import { Conversation } from '../../..';
import { find } from 'lodash';

// Mock dependencies
jest.mock('../use_conversation');
jest.mock('../helpers');
jest.mock('fast-deep-equal');
jest.mock('lodash');
const mockData = {
  welcome_id: {
    id: 'welcome_id',
    title: 'Welcome',
    category: 'assistant',
    messages: [],
    apiConfig: {
      connectorId: '123',
      actionTypeId: '.gen-ai',
      defaultSystemPromptId: 'system-prompt-id',
    },
    replacements: {},
  },
  electric_sheep_id: {
    id: 'electric_sheep_id',
    category: 'assistant',
    title: 'electric sheep',
    messages: [],
    apiConfig: { connectorId: '123', actionTypeId: '.gen-ai' },
    replacements: {},
  },
};
describe('useCurrentConversation', () => {
  const mockUseConversation = {
    createConversation: jest.fn(),
    deleteConversation: jest.fn(),
    getConversation: jest.fn(),
    getDefaultConversation: jest.fn(),
    setApiConfig: jest.fn(),
  };

  beforeEach(() => {
    (useConversation as jest.Mock).mockReturnValue(mockUseConversation);
    (deepEqual as jest.Mock).mockReturnValue(false);
    (find as jest.Mock).mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: Props = {
    // @ts-ignore not exact system prompt type, ok for test
    allSystemPrompts: [{ id: 'system-prompt-id' }, { id: 'something-crazy' }],
    conversationId: '',
    conversations: {},
    mayUpdateConversations: true,
    refetchCurrentUserConversations: jest.fn().mockResolvedValue({ data: mockData }),
  };

  const setupHook = (props: Partial<Props> = {}) => {
    return renderHook(() => useCurrentConversation({ ...defaultProps, ...props }));
  };

  it('should initialize with correct default values', () => {
    const { result } = setupHook();

    expect(result.current.currentConversation).toBeUndefined();
    expect(result.current.currentSystemPrompt).toBeUndefined();
  });

  it('should set the current system prompt ID when the prompt selection changes', async () => {
    const conversationId = 'welcome_id';
    const conversation = mockData.welcome_id;
    mockUseConversation.getConversation.mockResolvedValue(conversation);

    const { result } = setupHook({
      conversationId,
      conversations: { [conversationId]: conversation },
    });

    await act(async () => {
      await result.current.setCurrentSystemPromptId('prompt-id');
    });

    expect(mockUseConversation.setApiConfig).toHaveBeenCalledWith({
      conversation,
      apiConfig: {
        ...conversation.apiConfig,
        defaultSystemPromptId: 'prompt-id',
      },
    });
    expect(defaultProps.refetchCurrentUserConversations).toHaveBeenCalled();
  });

  it('should fetch and set the current conversation', async () => {
    const conversationId = 'welcome_id';
    const conversation = mockData.welcome_id;
    mockUseConversation.getConversation.mockResolvedValue(conversation);

    const { result } = setupHook({
      conversationId,
      conversations: { [conversationId]: conversation },
    });

    await act(async () => {
      await result.current.refetchCurrentConversation({ cId: conversationId });
    });

    expect(result.current.currentConversation).toEqual(conversation);
  });

  it('should handle conversation selection', async () => {
    const conversationId = 'test-id';
    const conversationTitle = 'Test Conversation';
    const conversation = {
      ...mockData.welcome_id,
      id: conversationId,
      title: conversationTitle,
      apiConfig: {
        ...mockData.welcome_id.apiConfig,
        defaultSystemPromptId: 'something-crazy',
      },
    } as Conversation;
    const mockConversations = {
      ...mockData,
      [conversationId]: conversation,
    };
    (find as jest.Mock).mockReturnValue(conversation);

    const { result } = setupHook({
      conversationId: mockData.welcome_id.id,
      conversations: mockConversations,
      refetchCurrentUserConversations: jest.fn().mockResolvedValue({
        data: mockConversations,
      }),
    });

    await act(async () => {
      await result.current.handleOnConversationSelected({
        cId: conversationId,
        cTitle: conversationTitle,
      });
    });

    expect(result.current.currentConversation).toEqual(conversation);
    expect(result.current.currentSystemPrompt?.id).toBe('something-crazy');
  });

  it('should non-existing handle conversation selection', async () => {
    const conversationId = 'test-id';
    const conversationTitle = 'Test Conversation';
    const conversation = {
      ...mockData.welcome_id,
      id: conversationId,
      title: conversationTitle,
    } as Conversation;
    const mockConversations = {
      ...mockData,
      [conversationId]: conversation,
    };
    (find as jest.Mock).mockReturnValue(conversation);

    const { result } = setupHook({
      conversationId: mockData.welcome_id.id,
      conversations: mockConversations,
      refetchCurrentUserConversations: jest.fn().mockResolvedValue({
        data: mockConversations,
      }),
    });

    await act(async () => {
      await result.current.handleOnConversationSelected({
        cId: 'bad',
        cTitle: 'bad',
      });
    });

    expect(result.current.currentConversation).toEqual(mockData.welcome_id);
    expect(result.current.currentSystemPrompt?.id).toBe('system-prompt-id');
  });

  it('should create a new conversation', async () => {
    const newConversation = {
      ...mockData.welcome_id,
      id: 'new-id',
      title: 'NEW_CHAT',
      messages: [],
    } as Conversation;
    mockUseConversation.createConversation.mockResolvedValue(newConversation);

    const { result } = setupHook({
      conversations: {
        'old-id': {
          ...mockData.welcome_id,
          id: 'old-id',
          title: 'Old Chat',
          messages: [],
        } as Conversation,
      },
      refetchCurrentUserConversations: jest.fn().mockResolvedValue({
        data: {
          'old-id': {
            ...mockData.welcome_id,
            id: 'old-id',
            title: 'Old Chat',
            messages: [],
          } as Conversation,
          [newConversation.id]: newConversation,
        },
      }),
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    expect(mockUseConversation.createConversation).toHaveBeenCalled();
  });

  it('should create a new conversation using the connector portion of the apiConfig of the current conversation', async () => {
    const newConversation = {
      ...mockData.welcome_id,
      id: 'new-id',
      title: 'NEW_CHAT',
      messages: [],
    } as Conversation;
    mockUseConversation.createConversation.mockResolvedValue(newConversation);

    const { result } = setupHook({
      conversations: {
        'old-id': {
          ...mockData.welcome_id,
          id: 'old-id',
          title: 'Old Chat',
          messages: [],
        } as Conversation,
      },
      conversationId: 'old-id',
      refetchCurrentUserConversations: jest.fn().mockResolvedValue({
        data: {
          'old-id': {
            ...mockData.welcome_id,
            id: 'old-id',
            title: 'Old Chat',
            messages: [],
          } as Conversation,
          [newConversation.id]: newConversation,
        },
      }),
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });
    const { defaultSystemPromptId: _, ...everythingExceptSystemPromptId } =
      mockData.welcome_id.apiConfig;

    expect(mockUseConversation.createConversation).toHaveBeenCalledWith({
      apiConfig: everythingExceptSystemPromptId,
      title: 'New chat',
    });
  });

  it('should create a new conversation with correct isNewConversationDefault: true system prompt', async () => {
    const newConversation = {
      ...mockData.welcome_id,
      id: 'new-id',
      title: 'NEW_CHAT',
      messages: [],
    } as Conversation;
    mockUseConversation.createConversation.mockResolvedValue(newConversation);

    const { result } = setupHook({
      conversations: {
        'old-id': {
          ...mockData.welcome_id,
          id: 'old-id',
          title: 'Old Chat',
          messages: [],
        } as Conversation,
      },
      allSystemPrompts: [
        {
          timestamp: '2024-09-10T15:52:24.761Z',
          users: [
            {
              id: 'u_mGBROF_q5bmFCATbLXAcCwKa0k8JvONAwSruelyKA5E_0',
              name: 'elastic',
            },
          ],
          content: 'Address the user as Mr Orange in each response',
          isNewConversationDefault: true,
          updatedAt: '2024-09-10T22:07:44.915Z',
          id: 'LBOi3JEBy3uD9EGi1d_G',
          name: 'Call me Orange',
          promptType: 'system',
          consumer: 'securitySolutionUI',
        },
      ],
      conversationId: 'old-id',
      refetchCurrentUserConversations: jest.fn().mockResolvedValue({
        data: {
          'old-id': {
            ...mockData.welcome_id,
            id: 'old-id',
            title: 'Old Chat',
            messages: [],
          } as Conversation,
          [newConversation.id]: newConversation,
        },
      }),
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    const { defaultSystemPromptId: _, ...everythingExceptSystemPromptId } =
      mockData.welcome_id.apiConfig;

    await waitFor(() =>
      expect(mockUseConversation.createConversation).toHaveBeenCalledWith({
        apiConfig: {
          ...everythingExceptSystemPromptId,
          defaultSystemPromptId: 'LBOi3JEBy3uD9EGi1d_G',
        },
        title: 'New chat',
      })
    );
  });

  it('should delete a conversation', async () => {
    const conversationTitle = 'Test Conversation';
    const conversation = {
      ...mockData.welcome_id,
      id: 'test-id',
      title: conversationTitle,
      messages: [],
    } as Conversation;

    const { result } = setupHook({
      conversations: { ...mockData, 'test-id': conversation },
    });

    await act(async () => {
      await result.current.handleOnConversationDeleted('test-id');
    });

    expect(mockUseConversation.deleteConversation).toHaveBeenCalledWith('test-id');
    expect(result.current.currentConversation).toBeUndefined();
  });

  it('should refetch the conversation multiple times if isStreamRefetch is true', async () => {
    const conversationId = 'test-id';
    const conversation = { id: conversationId, messages: [{ role: 'user' }] } as Conversation;
    mockUseConversation.getConversation.mockResolvedValue(conversation);

    const { result } = setupHook({
      conversationId,
      conversations: { [conversationId]: conversation },
    });

    await act(async () => {
      await result.current.refetchCurrentConversation({
        cId: conversationId,
        isStreamRefetch: true,
      });
    });

    expect(mockUseConversation.getConversation).toHaveBeenCalledTimes(6); // initial + 5 retries
  });
});
