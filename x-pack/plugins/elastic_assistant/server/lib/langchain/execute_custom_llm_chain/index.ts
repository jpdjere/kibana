/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { RetrievalQAChain } from 'langchain/chains';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ChainTool, DynamicTool, Tool } from 'langchain/tools';

import axios from 'axios';
import { ElasticsearchStore } from '../elasticsearch_store/elasticsearch_store';
import { ActionsClientLlm } from '../llm/actions_client_llm';
import { KNOWLEDGE_BASE_INDEX_PATTERN } from '../../../routes/knowledge_base/constants';
import type { AgentExecutorParams, AgentExecutorResponse } from '../executors/types';

export const callAgentExecutor = async ({
  actions,
  connectorId,
  esClient,
  langChainMessages,
  llmType,
  logger,
  request,
  elserId,
}: AgentExecutorParams): AgentExecutorResponse => {
  const llm = new ActionsClientLlm({ actions, connectorId, request, llmType, logger });

  const pastMessages = langChainMessages.slice(0, -1); // all but the last message
  const latestMessage = langChainMessages.slice(-1); // the last message

  // take all previous messages and create a memory
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
    memoryKey: 'chat_history', // this is the key expected by https://github.com/langchain-ai/langchainjs/blob/a13a8969345b0f149c1ca4a120d63508b06c52a5/langchain/src/agents/initialize.ts#L166
    inputKey: 'input',
    outputKey: 'output',
    returnMessages: true,
  });

  // ELSER backed ElasticsearchStore for Knowledge Base
  const esStore = new ElasticsearchStore(esClient, KNOWLEDGE_BASE_INDEX_PATTERN, logger, elserId);
  const chain = RetrievalQAChain.fromLLM(llm, esStore.asRetriever());

  const tools: Tool[] = [
    // new ChainTool({
    //   name: 'esql-language-knowledge-base',
    //   description:
    //     'Call this for knowledge on how to build an ESQL query, or answer questions about the ES|QL query language.',
    //   chain,
    // }),
    new DynamicTool({
      name: 'get_rule_health',
      verbose: true,
      description:
        'Call this function when asked about the rule health and use its return value to answer the question using the language style from the return value',
      func: async () => {
        try {
          const res = await axios.get(
            `http://localhost:5601/kbn/internal/detection_engine/health/_cluster`,
            {
              headers: {
                'elastic-api-version': 1,
                ...request.headers,
              },
            }
          );
          // console.log('\n\n\n\n\n\n', JSON.stringify(res.data, null, 2), '\n\n\n\n\n\n');
          return JSON.stringify(res.data);
        } catch (error) {
          console.log('\n\n\n\n\n\n', error, '\n\n\n\n\n\n');
          return 'error';
        }
      },
    }),
    new DynamicTool({
      name: 'enable_all_rules',
      verbose: true,
      description: 'Use the function below to enable all rules',
      func: async () => {
        try {
          fetch(
            'http://localhost:5601/kbn/api/detection_engine/rules/_find?page=1&per_page=20&sort_field=enabled&sort_order=desc',
            {
              headers: {
                accept: '*/*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'elastic-api-version': '2023-10-31',
                'kbn-build-number': '9007199254740991',
                'kbn-version': '8.12.0',
                'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                traceparent: '00-40ad56938c9bc33abfe79359c3a7fbe6-a77aa3bee9daba6d-01',
                'x-elastic-internal-origin': 'Kibana',
                'x-kbn-context':
                  '%7B%22type%22%3A%22application%22%2C%22name%22%3A%22securitySolutionUI%22%2C%22url%22%3A%22%2Fkbn%2Fapp%2Fsecurity%2Frules%2Fmanagement%22%2C%22page%22%3A%22%2Frules%2Fmanagement%22%7D',
                cookie:
                  'sid=Fe26.2**031db2c8fe24d6108e04b5239ab868b039eb176efb685d357ab8c68ac15fdbeb*4ZJ3hAEYe4VP1DXtVY_GpQ*N3k18lTQwMU9kCXVKvEhriimYKAkBtCFZNsEi-YIVge92DlAYA6bbAqOI2EQd7drrAuvUPkYzZZ_1LKSo2oUUsbjL_-SBurvExEli4SvDzyFd4dEyMHapHUUWuI7w_O9AU3r-BictEyTEi2Ywmc8izvOsJgePhyuqSerM68NuUBVnsX6IJK7U308nTTdp2mZfF9JEQqORPLdZPsFIKTZvFdeypYQg4-pLmwdXOh45mMsKoacKg-V0VGfPfoyOTngSLD9brvgDwWR-rRYiCMxEw**00cc46654ce902bbd985ca08ad9ed07fc411f943f03134fb97bc898608d83376*duo8712WIqxgGjD2qMfSjeK8en8RgHAfLHQxDUiwzZU',
              },
              referrer:
                'http://localhost:5601/kbn/app/security/rules/management?sourcerer=(default:(id:security-solution-default,selectedPatterns:!()))&timeline=(activeTab:query,graphEventId:%27%27,isOpen:!f)',
              referrerPolicy: 'no-referrer-when-downgrade',
              body: null,
              method: 'GET',
              mode: 'cors',
              credentials: 'include',
            }
          )
            .then((res) => res.json())
            .then((res) => {
              console.log('\n\n\n\n111111', { res });
              const rulesIds = res.data.map((rule) => rule.id);
              console.log({ rulesIds });
              fetch(
                'http://localhost:5601/kbn/api/detection_engine/rules/_bulk_action?dry_run=false',
                {
                  headers: {
                    accept: '*/*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'content-type': 'application/json',
                    'elastic-api-version': '2023-10-31',
                    'kbn-build-number': '9007199254740991',
                    'kbn-version': '8.12.0',
                    'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    traceparent:
                      '00-61a27111bddbacdffea243a72a70628f-1bea739b2eda0a10-01, 00-3c6d0b3be2f5d6936e8043625b77dd4c-3573f9c5d4dd91c9-01',
                    'x-elastic-internal-origin': 'Kibana',
                    'x-kbn-context':
                      '%7B%22type%22%3A%22application%22%2C%22name%22%3A%22securitySolutionUI%22%2C%22url%22%3A%22%2Fkbn%2Fapp%2Fsecurity%2Fget_started%22%2C%22page%22%3A%22%2Frules%2Fmanagement%22%7D',
                    cookie:
                      'sid=Fe26.2**031db2c8fe24d6108e04b5239ab868b039eb176efb685d357ab8c68ac15fdbeb*4ZJ3hAEYe4VP1DXtVY_GpQ*N3k18lTQwMU9kCXVKvEhriimYKAkBtCFZNsEi-YIVge92DlAYA6bbAqOI2EQd7drrAuvUPkYzZZ_1LKSo2oUUsbjL_-SBurvExEli4SvDzyFd4dEyMHapHUUWuI7w_O9AU3r-BictEyTEi2Ywmc8izvOsJgePhyuqSerM68NuUBVnsX6IJK7U308nTTdp2mZfF9JEQqORPLdZPsFIKTZvFdeypYQg4-pLmwdXOh45mMsKoacKg-V0VGfPfoyOTngSLD9brvgDwWR-rRYiCMxEw**00cc46654ce902bbd985ca08ad9ed07fc411f943f03134fb97bc898608d83376*duo8712WIqxgGjD2qMfSjeK8en8RgHAfLHQxDUiwzZU',
                    Referer:
                      'http://localhost:5601/kbn/app/security/rules/management?sourcerer=(default:(id:security-solution-default,selectedPatterns:!()))&timeline=(activeTab:query,graphEventId:%27%27,isOpen:!f)',
                    'Referrer-Policy': 'no-referrer-when-downgrade',
                  },
                  body: '{"action":"enable","ids":["e6d28601-66be-11ee-a492-cfc5736024aa","e6d2ad10-66be-11ee-a492-cfc5736024aa","e21d3b50-66be-11ee-a492-cfc5736024aa","e3bb33e0-66be-11ee-a492-cfc5736024aa","ee2b0440-66be-11ee-a492-cfc5736024aa","e6d28600-66be-11ee-a492-cfc5736024aa","e28795e0-66be-11ee-a492-cfc5736024aa"]}',
                  method: 'POST',
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  console.log('\n\n\n\n', { res });
                  return res.body;
                });
            });
        } catch (error) {
          console.log('\n\n\n\n\n\n', error, '\n\n\n\n\n\n');
          return 'error';
        }
      },
    }),
    new DynamicTool({
      name: 'disable_all_rules',
      verbose: true,
      description: 'Use the function below to disable all rules',
      func: async () => {
        try {
          fetch(
            'http://localhost:5601/kbn/api/detection_engine/rules/_find?page=1&per_page=20&sort_field=enabled&sort_order=desc',
            {
              headers: {
                accept: '*/*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'elastic-api-version': '2023-10-31',
                'kbn-build-number': '9007199254740991',
                'kbn-version': '8.12.0',
                'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                traceparent: '00-40ad56938c9bc33abfe79359c3a7fbe6-a77aa3bee9daba6d-01',
                'x-elastic-internal-origin': 'Kibana',
                'x-kbn-context':
                  '%7B%22type%22%3A%22application%22%2C%22name%22%3A%22securitySolutionUI%22%2C%22url%22%3A%22%2Fkbn%2Fapp%2Fsecurity%2Frules%2Fmanagement%22%2C%22page%22%3A%22%2Frules%2Fmanagement%22%7D',
                cookie:
                  'sid=Fe26.2**031db2c8fe24d6108e04b5239ab868b039eb176efb685d357ab8c68ac15fdbeb*4ZJ3hAEYe4VP1DXtVY_GpQ*N3k18lTQwMU9kCXVKvEhriimYKAkBtCFZNsEi-YIVge92DlAYA6bbAqOI2EQd7drrAuvUPkYzZZ_1LKSo2oUUsbjL_-SBurvExEli4SvDzyFd4dEyMHapHUUWuI7w_O9AU3r-BictEyTEi2Ywmc8izvOsJgePhyuqSerM68NuUBVnsX6IJK7U308nTTdp2mZfF9JEQqORPLdZPsFIKTZvFdeypYQg4-pLmwdXOh45mMsKoacKg-V0VGfPfoyOTngSLD9brvgDwWR-rRYiCMxEw**00cc46654ce902bbd985ca08ad9ed07fc411f943f03134fb97bc898608d83376*duo8712WIqxgGjD2qMfSjeK8en8RgHAfLHQxDUiwzZU',
              },
              referrer:
                'http://localhost:5601/kbn/app/security/rules/management?sourcerer=(default:(id:security-solution-default,selectedPatterns:!()))&timeline=(activeTab:query,graphEventId:%27%27,isOpen:!f)',
              referrerPolicy: 'no-referrer-when-downgrade',
              body: null,
              method: 'GET',
              mode: 'cors',
              credentials: 'include',
            }
          )
            .then((res) => res.json())
            .then((res) => {
              console.log('\n\n\n\n111111', { res });
              const rulesIds = res.data.map((rule) => rule.id);
              console.log({ rulesIds });
              fetch(
                'http://localhost:5601/kbn/api/detection_engine/rules/_bulk_action?dry_run=false',
                {
                  headers: {
                    accept: '*/*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'content-type': 'application/json',
                    'elastic-api-version': '2023-10-31',
                    'kbn-build-number': '9007199254740991',
                    'kbn-version': '8.12.0',
                    'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    traceparent:
                      '00-61a27111bddbacdffea243a72a70628f-1bea739b2eda0a10-01, 00-3c6d0b3be2f5d6936e8043625b77dd4c-3573f9c5d4dd91c9-01',
                    'x-elastic-internal-origin': 'Kibana',
                    'x-kbn-context':
                      '%7B%22type%22%3A%22application%22%2C%22name%22%3A%22securitySolutionUI%22%2C%22url%22%3A%22%2Fkbn%2Fapp%2Fsecurity%2Fget_started%22%2C%22page%22%3A%22%2Frules%2Fmanagement%22%7D',
                    cookie:
                      'sid=Fe26.2**031db2c8fe24d6108e04b5239ab868b039eb176efb685d357ab8c68ac15fdbeb*4ZJ3hAEYe4VP1DXtVY_GpQ*N3k18lTQwMU9kCXVKvEhriimYKAkBtCFZNsEi-YIVge92DlAYA6bbAqOI2EQd7drrAuvUPkYzZZ_1LKSo2oUUsbjL_-SBurvExEli4SvDzyFd4dEyMHapHUUWuI7w_O9AU3r-BictEyTEi2Ywmc8izvOsJgePhyuqSerM68NuUBVnsX6IJK7U308nTTdp2mZfF9JEQqORPLdZPsFIKTZvFdeypYQg4-pLmwdXOh45mMsKoacKg-V0VGfPfoyOTngSLD9brvgDwWR-rRYiCMxEw**00cc46654ce902bbd985ca08ad9ed07fc411f943f03134fb97bc898608d83376*duo8712WIqxgGjD2qMfSjeK8en8RgHAfLHQxDUiwzZU',
                    Referer:
                      'http://localhost:5601/kbn/app/security/rules/management?sourcerer=(default:(id:security-solution-default,selectedPatterns:!()))&timeline=(activeTab:query,graphEventId:%27%27,isOpen:!f)',
                    'Referrer-Policy': 'no-referrer-when-downgrade',
                  },
                  body: '{"action":"disable","ids":["e6d28601-66be-11ee-a492-cfc5736024aa","e6d2ad10-66be-11ee-a492-cfc5736024aa","e21d3b50-66be-11ee-a492-cfc5736024aa","e3bb33e0-66be-11ee-a492-cfc5736024aa","ee2b0440-66be-11ee-a492-cfc5736024aa","e6d28600-66be-11ee-a492-cfc5736024aa","e28795e0-66be-11ee-a492-cfc5736024aa"]}',
                  method: 'POST',
                }
              ).then((res) => {
                console.log('\n\n\n\n', { res: res.body });
                return res.body;
              });
            });
        } catch (error) {
          console.log('\n\n\n\n\n\n', error, '\n\n\n\n\n\n');
          return 'error';
        }
      },
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: 'chat-conversational-react-description',
    memory,
    verbose: true,
  });

  await executor.call({ input: latestMessage[0].content });

  return {
    connector_id: connectorId,
    data: llm.getActionResultData(), // the response from the actions framework
    status: 'ok',
  };
};
