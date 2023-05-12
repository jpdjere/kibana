/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dateMath from '@kbn/datemath';
import type { OnTimeChangeProps } from '@elastic/eui';
import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSuperDatePicker,
  EuiSuperUpdateButton,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import moment from 'moment';

import type { Rule } from '../../../../detection_engine/rule_management/logic';
import * as i18n from './translations';

import { useKibana } from '../../../../common/lib/kibana';

import { useStartTransaction } from '../../../../common/lib/apm/use_start_transaction';
import { SINGLE_RULE_ACTIONS } from '../../../../common/lib/apm/user_actions';
import type { TimeframePreviewOptions } from '../../../pages/detection_engine/rules/types';
import { useAdHocRunnerRoute } from './use_ad_hoc_runner_route';
import { AdHocRunHistogram } from './ad_hoc_run_histogram';

/* Imported from Rule Preview */
import { usePreviewInvocationCount } from '../rule_preview/use_preview_invocation_count';
import { LoadingHistogram } from '../rule_preview/loading_histogram';
import { PreviewLogsComponent } from '../rule_preview/preview_logs';

export const REASONABLE_INVOCATION_COUNT = 200;

const timeRanges = [
  { start: 'now/d', end: 'now', label: 'Today' },
  { start: 'now/w', end: 'now', label: 'This week' },
  { start: 'now-15m', end: 'now', label: 'Last 15 minutes' },
  { start: 'now-30m', end: 'now', label: 'Last 30 minutes' },
  { start: 'now-1h', end: 'now', label: 'Last 1 hour' },
  { start: 'now-24h', end: 'now', label: 'Last 24 hours' },
  { start: 'now-7d', end: 'now', label: 'Last 7 days' },
  { start: 'now-30d', end: 'now', label: 'Last 30 days' },
];

export interface RuleAdHocRunnerProps {
  rule: Rule;
}

const refreshedTimeframe = (startDate: string, endDate: string) => {
  return {
    start: dateMath.parse(startDate) || moment().subtract(1, 'hour'),
    end: dateMath.parse(endDate) || moment(),
  };
};

const RuleAdHocRunnerComponent: React.FC<RuleAdHocRunnerProps> = ({ rule }) => {
  const { spaces } = useKibana().services;

  const [spaceId, setSpaceId] = useState('');
  useEffect(() => {
    if (spaces) {
      spaces.getActiveSpace().then((space) => setSpaceId(space.id));
    }
  }, [spaces]);

  // Raw timeframe as a string
  const [startDate, setStartDate] = useState('now-1h');
  const [endDate, setEndDate] = useState('now');

  // Parsed timeframe as a Moment object
  const [timeframeStart, setTimeframeStart] = useState(moment().subtract(1, 'hour'));
  const [timeframeEnd, setTimeframeEnd] = useState(moment());

  const [isDateRangeInvalid, setIsDateRangeInvalid] = useState(false);

  useEffect(() => {
    const { start, end } = refreshedTimeframe(startDate, endDate);
    setTimeframeStart(start);
    setTimeframeEnd(end);
  }, [startDate, endDate]);

  // The data state that we used for the last ad hoc run results
  const [adHocRunOptions, setAdHocRunOptions] = useState<TimeframePreviewOptions>({
    timeframeStart,
    timeframeEnd,
    interval: '5m',
    lookback: '1m',
  });

  const { invocationCount } = usePreviewInvocationCount({
    timeframeOptions: {
      timeframeStart,
      timeframeEnd,
      interval: rule.interval,
      lookback: rule.meta?.from ?? '1m',
    },
  });
  const showInvocationCountWarning = invocationCount > REASONABLE_INVOCATION_COUNT;

  const {
    addNoiseWarning,
    createAdHocRun,
    isAdHocRunRequestInProgress,
    executionId,
    logs,
    hasNoiseWarning,
    isAborted,
  } = useAdHocRunnerRoute({
    rule,
    timeframeOptions: adHocRunOptions,
  });

  const { startTransaction } = useStartTransaction();

  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    createAdHocRun();
    setIsRefreshing(false);
  }, [isRefreshing, createAdHocRun]);

  useEffect(() => {
    const { start, end } = refreshedTimeframe(startDate, endDate);
    setTimeframeStart(start);
    setTimeframeEnd(end);
  }, [endDate, startDate]);

  const onTimeChange = useCallback(
    ({ start: newStart, end: newEnd, isInvalid }: OnTimeChangeProps) => {
      setIsDateRangeInvalid(isInvalid);
      if (!isInvalid) {
        setStartDate(newStart);
        setEndDate(newEnd);
      }
    },
    []
  );

  const onTimeframeRefresh = useCallback(() => {
    startTransaction({ name: SINGLE_RULE_ACTIONS.AD_HOC_RUN });
    const { start, end } = refreshedTimeframe(startDate, endDate);
    setTimeframeStart(start);
    setTimeframeEnd(end);
    setAdHocRunOptions({
      timeframeStart: start,
      timeframeEnd: end,
      interval: rule.interval,
      lookback: rule.from,
    });
    setIsRefreshing(true);
  }, [endDate, rule.from, rule.interval, startDate, startTransaction]);

  const isDirty = useMemo(
    () =>
      !timeframeStart.isSame(adHocRunOptions.timeframeStart) ||
      !timeframeEnd.isSame(adHocRunOptions.timeframeEnd),
    [adHocRunOptions.timeframeEnd, adHocRunOptions.timeframeStart, timeframeEnd, timeframeStart]
  );

  return (
    <>
      <EuiTitle size="m">
        <h2>{i18n.RULE_AD_HOC_RUN_FLYOUT_TITLE}</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiText color="subdued">
        <p>{i18n.RULE_AD_HOC_RUN_FLYOUT_DESCRIPTION}</p>
      </EuiText>
      <EuiSpacer size="s" />
      {showInvocationCountWarning && (
        <>
          <EuiCallOut
            color="warning"
            title={i18n.QUERY_AD_HOC_INVOCATION_COUNT_WARNING_TITLE}
            data-test-subj="adHocRunInvocationCountWarning"
          >
            {i18n.QUERY_AD_HOC_INVOCATION_COUNT_WARNING_MESSAGE}
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
      <EuiFormRow
        label={i18n.QUERY_AD_HOC_RUN_LABEL}
        error={undefined}
        isInvalid={false}
        data-test-subj="rule-ad-hoc-run"
        describedByIds={['rule-ad-hoc-run']}
      >
        <EuiFlexGroup alignItems="center" responsive={false} gutterSize="s">
          <EuiSuperDatePicker
            start={startDate}
            end={endDate}
            onTimeChange={onTimeChange}
            showUpdateButton={false}
            commonlyUsedRanges={timeRanges}
            onRefresh={onTimeframeRefresh}
            data-test-subj="ad-hoc-run-time-frame"
          />
          <EuiFlexItem grow={false}>
            <EuiSuperUpdateButton
              isDisabled={isDateRangeInvalid}
              iconType={isDirty ? 'kqlFunction' : 'refresh'}
              onClick={onTimeframeRefresh}
              color={isDirty ? 'success' : 'primary'}
              fill={true}
              data-test-subj="adHocRunSubmitButton"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>

      <EuiSpacer size="l" />
      {isAdHocRunRequestInProgress && <LoadingHistogram title={i18n.QUERY_GRAPH_HITS_TITLE} />}
      {!isAdHocRunRequestInProgress && executionId && spaceId && (
        <AdHocRunHistogram
          ruleType={rule.type}
          executionId={executionId}
          addNoiseWarning={addNoiseWarning}
          spaceId={spaceId}
          indexPattern={undefined}
          timeframeOptions={adHocRunOptions}
        />
      )}
      <PreviewLogsComponent logs={logs} hasNoiseWarning={hasNoiseWarning} isAborted={isAborted} />
    </>
  );
};

export const RuleAdHocRunner = React.memo(RuleAdHocRunnerComponent);
