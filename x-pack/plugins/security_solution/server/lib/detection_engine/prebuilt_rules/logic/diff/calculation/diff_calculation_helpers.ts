/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mapValues } from 'lodash';
import type {
  FieldsDiff,
  FieldsDiffAlgorithmsFor,
} from '../../../../../../../common/detection_engine/prebuilt_rules/model/diff/rule_diff/fields_diff';
import type { ThreeVersionsOf } from '../../../../../../../common/detection_engine/prebuilt_rules/model/diff/three_way_diff/three_way_diff';
import { MissingVersion } from '../../../../../../../common/detection_engine/prebuilt_rules/model/diff/three_way_diff/three_way_diff';

export const calculateFieldsDiffFor = <TObject extends object>(
  ruleVersions: ThreeVersionsOf<TObject, TObject>,
  fieldsDiffAlgorithms: FieldsDiffAlgorithmsFor<TObject>
): FieldsDiff<TObject> => {
  const result = mapValues(fieldsDiffAlgorithms, (calculateFieldDiff, fieldName) => {
    const fieldVersions = pickField(fieldName as keyof TObject, ruleVersions);
    const fieldDiff = calculateFieldDiff(fieldVersions);
    return fieldDiff;
  });
  // if (ruleVersions.target_version.rule_id === 'd76b02ef-fc95-4001-9297-01cb7412232f') { // Python
  if (ruleVersions.target_version.rule_id === 'a00681e3-9ed6-447c-ab2c-be648821c622') {
    // First seen AWS
    debugger;
  }
  // TODO: try to improve strict typing and get rid of this "as" operator.
  return result as FieldsDiff<TObject>;
};

const pickField = <TObject extends object>(
  fieldName: keyof TObject,
  versions: ThreeVersionsOf<TObject, TObject>
): ThreeVersionsOf<TObject[typeof fieldName], TObject[typeof fieldName]> => {
  return {
    base_version:
      versions.base_version !== MissingVersion ? versions.base_version[fieldName] : MissingVersion,
    current_version: versions.current_version[fieldName],
    target_version: versions.target_version[fieldName],
  };
};
