import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  date: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamp: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "attendance.config" */
export type Attendance_Config = {
  __typename?: 'attendance_config';
  ID: Scalars['Int']['output'];
  TimeDeduction: Scalars['numeric']['output'];
};

/** aggregated selection of "attendance.config" */
export type Attendance_Config_Aggregate = {
  __typename?: 'attendance_config_aggregate';
  aggregate?: Maybe<Attendance_Config_Aggregate_Fields>;
  nodes: Array<Attendance_Config>;
};

/** aggregate fields of "attendance.config" */
export type Attendance_Config_Aggregate_Fields = {
  __typename?: 'attendance_config_aggregate_fields';
  avg?: Maybe<Attendance_Config_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Attendance_Config_Max_Fields>;
  min?: Maybe<Attendance_Config_Min_Fields>;
  stddev?: Maybe<Attendance_Config_Stddev_Fields>;
  stddev_pop?: Maybe<Attendance_Config_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Attendance_Config_Stddev_Samp_Fields>;
  sum?: Maybe<Attendance_Config_Sum_Fields>;
  var_pop?: Maybe<Attendance_Config_Var_Pop_Fields>;
  var_samp?: Maybe<Attendance_Config_Var_Samp_Fields>;
  variance?: Maybe<Attendance_Config_Variance_Fields>;
};


/** aggregate fields of "attendance.config" */
export type Attendance_Config_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Attendance_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Attendance_Config_Avg_Fields = {
  __typename?: 'attendance_config_avg_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "attendance.config". All fields are combined with a logical 'AND'. */
export type Attendance_Config_Bool_Exp = {
  ID?: InputMaybe<Int_Comparison_Exp>;
  TimeDeduction?: InputMaybe<Numeric_Comparison_Exp>;
  _and?: InputMaybe<Array<Attendance_Config_Bool_Exp>>;
  _not?: InputMaybe<Attendance_Config_Bool_Exp>;
  _or?: InputMaybe<Array<Attendance_Config_Bool_Exp>>;
};

/** unique or primary key constraints on table "attendance.config" */
export enum Attendance_Config_Constraint {
  /** unique or primary key constraint on columns "ID" */
  ConfigPkey = 'config_pkey'
}

/** input type for incrementing numeric columns in table "attendance.config" */
export type Attendance_Config_Inc_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  TimeDeduction?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "attendance.config" */
export type Attendance_Config_Insert_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  TimeDeduction?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type Attendance_Config_Max_Fields = {
  __typename?: 'attendance_config_max_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  TimeDeduction?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Attendance_Config_Min_Fields = {
  __typename?: 'attendance_config_min_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  TimeDeduction?: Maybe<Scalars['numeric']['output']>;
};

/** response of any mutation on the table "attendance.config" */
export type Attendance_Config_Mutation_Response = {
  __typename?: 'attendance_config_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Attendance_Config>;
};

/** on_conflict condition type for table "attendance.config" */
export type Attendance_Config_On_Conflict = {
  constraint: Attendance_Config_Constraint;
  update_columns?: Array<Attendance_Config_Update_Column>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};

/** Ordering options when selecting data from "attendance.config". */
export type Attendance_Config_Order_By = {
  ID?: InputMaybe<Order_By>;
  TimeDeduction?: InputMaybe<Order_By>;
};

/** primary key columns input for table: attendance.config */
export type Attendance_Config_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "attendance.config" */
export enum Attendance_Config_Select_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  TimeDeduction = 'TimeDeduction'
}

/** input type for updating data in table "attendance.config" */
export type Attendance_Config_Set_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  TimeDeduction?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Attendance_Config_Stddev_Fields = {
  __typename?: 'attendance_config_stddev_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Attendance_Config_Stddev_Pop_Fields = {
  __typename?: 'attendance_config_stddev_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Attendance_Config_Stddev_Samp_Fields = {
  __typename?: 'attendance_config_stddev_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "attendance_config" */
export type Attendance_Config_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Attendance_Config_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Attendance_Config_Stream_Cursor_Value_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  TimeDeduction?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Attendance_Config_Sum_Fields = {
  __typename?: 'attendance_config_sum_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  TimeDeduction?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "attendance.config" */
export enum Attendance_Config_Update_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  TimeDeduction = 'TimeDeduction'
}

export type Attendance_Config_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Attendance_Config_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Attendance_Config_Set_Input>;
  /** filter the rows which have to be updated */
  where: Attendance_Config_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Attendance_Config_Var_Pop_Fields = {
  __typename?: 'attendance_config_var_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Attendance_Config_Var_Samp_Fields = {
  __typename?: 'attendance_config_var_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Attendance_Config_Variance_Fields = {
  __typename?: 'attendance_config_variance_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  TimeDeduction?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "attendance.intervals" */
export type Attendance_Intervals = {
  __typename?: 'attendance_intervals';
  card: Scalars['String']['output'];
  database?: Maybe<Scalars['String']['output']>;
  ent?: Maybe<Scalars['timestamp']['output']>;
  ent_event_id: Scalars['Int']['output'];
  ext?: Maybe<Scalars['timestamp']['output']>;
  ext_event_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  user: Attendance_Users;
};

/** aggregated selection of "attendance.intervals" */
export type Attendance_Intervals_Aggregate = {
  __typename?: 'attendance_intervals_aggregate';
  aggregate?: Maybe<Attendance_Intervals_Aggregate_Fields>;
  nodes: Array<Attendance_Intervals>;
};

export type Attendance_Intervals_Aggregate_Bool_Exp = {
  count?: InputMaybe<Attendance_Intervals_Aggregate_Bool_Exp_Count>;
};

export type Attendance_Intervals_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Attendance_Intervals_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "attendance.intervals" */
export type Attendance_Intervals_Aggregate_Fields = {
  __typename?: 'attendance_intervals_aggregate_fields';
  avg?: Maybe<Attendance_Intervals_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Attendance_Intervals_Max_Fields>;
  min?: Maybe<Attendance_Intervals_Min_Fields>;
  stddev?: Maybe<Attendance_Intervals_Stddev_Fields>;
  stddev_pop?: Maybe<Attendance_Intervals_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Attendance_Intervals_Stddev_Samp_Fields>;
  sum?: Maybe<Attendance_Intervals_Sum_Fields>;
  var_pop?: Maybe<Attendance_Intervals_Var_Pop_Fields>;
  var_samp?: Maybe<Attendance_Intervals_Var_Samp_Fields>;
  variance?: Maybe<Attendance_Intervals_Variance_Fields>;
};


/** aggregate fields of "attendance.intervals" */
export type Attendance_Intervals_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "attendance.intervals" */
export type Attendance_Intervals_Aggregate_Order_By = {
  avg?: InputMaybe<Attendance_Intervals_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Attendance_Intervals_Max_Order_By>;
  min?: InputMaybe<Attendance_Intervals_Min_Order_By>;
  stddev?: InputMaybe<Attendance_Intervals_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Attendance_Intervals_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Attendance_Intervals_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Attendance_Intervals_Sum_Order_By>;
  var_pop?: InputMaybe<Attendance_Intervals_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Attendance_Intervals_Var_Samp_Order_By>;
  variance?: InputMaybe<Attendance_Intervals_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "attendance.intervals" */
export type Attendance_Intervals_Arr_Rel_Insert_Input = {
  data: Array<Attendance_Intervals_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Attendance_Intervals_On_Conflict>;
};

/** aggregate avg on columns */
export type Attendance_Intervals_Avg_Fields = {
  __typename?: 'attendance_intervals_avg_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Avg_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "attendance.intervals". All fields are combined with a logical 'AND'. */
export type Attendance_Intervals_Bool_Exp = {
  _and?: InputMaybe<Array<Attendance_Intervals_Bool_Exp>>;
  _not?: InputMaybe<Attendance_Intervals_Bool_Exp>;
  _or?: InputMaybe<Array<Attendance_Intervals_Bool_Exp>>;
  card?: InputMaybe<String_Comparison_Exp>;
  database?: InputMaybe<String_Comparison_Exp>;
  ent?: InputMaybe<Timestamp_Comparison_Exp>;
  ent_event_id?: InputMaybe<Int_Comparison_Exp>;
  ext?: InputMaybe<Timestamp_Comparison_Exp>;
  ext_event_id?: InputMaybe<Int_Comparison_Exp>;
  user?: InputMaybe<Attendance_Users_Bool_Exp>;
};

/** unique or primary key constraints on table "attendance.intervals" */
export enum Attendance_Intervals_Constraint {
  /** unique or primary key constraint on columns "ent_event_id" */
  EntEventId = 'ent_event_id',
  /** unique or primary key constraint on columns "card", "ent_event_id" */
  IntervalsPkey = 'intervals_pkey'
}

/** input type for incrementing numeric columns in table "attendance.intervals" */
export type Attendance_Intervals_Inc_Input = {
  ent_event_id?: InputMaybe<Scalars['Int']['input']>;
  ext_event_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "attendance.intervals" */
export type Attendance_Intervals_Insert_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  database?: InputMaybe<Scalars['String']['input']>;
  ent?: InputMaybe<Scalars['timestamp']['input']>;
  ent_event_id?: InputMaybe<Scalars['Int']['input']>;
  ext?: InputMaybe<Scalars['timestamp']['input']>;
  ext_event_id?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Attendance_Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Attendance_Intervals_Max_Fields = {
  __typename?: 'attendance_intervals_max_fields';
  card?: Maybe<Scalars['String']['output']>;
  database?: Maybe<Scalars['String']['output']>;
  ent?: Maybe<Scalars['timestamp']['output']>;
  ent_event_id?: Maybe<Scalars['Int']['output']>;
  ext?: Maybe<Scalars['timestamp']['output']>;
  ext_event_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Max_Order_By = {
  card?: InputMaybe<Order_By>;
  database?: InputMaybe<Order_By>;
  ent?: InputMaybe<Order_By>;
  ent_event_id?: InputMaybe<Order_By>;
  ext?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Attendance_Intervals_Min_Fields = {
  __typename?: 'attendance_intervals_min_fields';
  card?: Maybe<Scalars['String']['output']>;
  database?: Maybe<Scalars['String']['output']>;
  ent?: Maybe<Scalars['timestamp']['output']>;
  ent_event_id?: Maybe<Scalars['Int']['output']>;
  ext?: Maybe<Scalars['timestamp']['output']>;
  ext_event_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Min_Order_By = {
  card?: InputMaybe<Order_By>;
  database?: InputMaybe<Order_By>;
  ent?: InputMaybe<Order_By>;
  ent_event_id?: InputMaybe<Order_By>;
  ext?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "attendance.intervals" */
export type Attendance_Intervals_Mutation_Response = {
  __typename?: 'attendance_intervals_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Attendance_Intervals>;
};

/** on_conflict condition type for table "attendance.intervals" */
export type Attendance_Intervals_On_Conflict = {
  constraint: Attendance_Intervals_Constraint;
  update_columns?: Array<Attendance_Intervals_Update_Column>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};

/** Ordering options when selecting data from "attendance.intervals". */
export type Attendance_Intervals_Order_By = {
  card?: InputMaybe<Order_By>;
  database?: InputMaybe<Order_By>;
  ent?: InputMaybe<Order_By>;
  ent_event_id?: InputMaybe<Order_By>;
  ext?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
  user?: InputMaybe<Attendance_Users_Order_By>;
};

/** primary key columns input for table: attendance.intervals */
export type Attendance_Intervals_Pk_Columns_Input = {
  card: Scalars['String']['input'];
  ent_event_id: Scalars['Int']['input'];
};

/** select columns of table "attendance.intervals" */
export enum Attendance_Intervals_Select_Column {
  /** column name */
  Card = 'card',
  /** column name */
  Database = 'database',
  /** column name */
  Ent = 'ent',
  /** column name */
  EntEventId = 'ent_event_id',
  /** column name */
  Ext = 'ext',
  /** column name */
  ExtEventId = 'ext_event_id'
}

/** input type for updating data in table "attendance.intervals" */
export type Attendance_Intervals_Set_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  database?: InputMaybe<Scalars['String']['input']>;
  ent?: InputMaybe<Scalars['timestamp']['input']>;
  ent_event_id?: InputMaybe<Scalars['Int']['input']>;
  ext?: InputMaybe<Scalars['timestamp']['input']>;
  ext_event_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Attendance_Intervals_Stddev_Fields = {
  __typename?: 'attendance_intervals_stddev_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Stddev_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Attendance_Intervals_Stddev_Pop_Fields = {
  __typename?: 'attendance_intervals_stddev_pop_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Stddev_Pop_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Attendance_Intervals_Stddev_Samp_Fields = {
  __typename?: 'attendance_intervals_stddev_samp_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Stddev_Samp_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "attendance_intervals" */
export type Attendance_Intervals_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Attendance_Intervals_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Attendance_Intervals_Stream_Cursor_Value_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  database?: InputMaybe<Scalars['String']['input']>;
  ent?: InputMaybe<Scalars['timestamp']['input']>;
  ent_event_id?: InputMaybe<Scalars['Int']['input']>;
  ext?: InputMaybe<Scalars['timestamp']['input']>;
  ext_event_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Attendance_Intervals_Sum_Fields = {
  __typename?: 'attendance_intervals_sum_fields';
  ent_event_id?: Maybe<Scalars['Int']['output']>;
  ext_event_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Sum_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** update columns of table "attendance.intervals" */
export enum Attendance_Intervals_Update_Column {
  /** column name */
  Card = 'card',
  /** column name */
  Database = 'database',
  /** column name */
  Ent = 'ent',
  /** column name */
  EntEventId = 'ent_event_id',
  /** column name */
  Ext = 'ext',
  /** column name */
  ExtEventId = 'ext_event_id'
}

export type Attendance_Intervals_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Attendance_Intervals_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Attendance_Intervals_Set_Input>;
  /** filter the rows which have to be updated */
  where: Attendance_Intervals_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Attendance_Intervals_Var_Pop_Fields = {
  __typename?: 'attendance_intervals_var_pop_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Var_Pop_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Attendance_Intervals_Var_Samp_Fields = {
  __typename?: 'attendance_intervals_var_samp_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Var_Samp_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Attendance_Intervals_Variance_Fields = {
  __typename?: 'attendance_intervals_variance_fields';
  ent_event_id?: Maybe<Scalars['Float']['output']>;
  ext_event_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "attendance.intervals" */
export type Attendance_Intervals_Variance_Order_By = {
  ent_event_id?: InputMaybe<Order_By>;
  ext_event_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "attendance.users" */
export type Attendance_Users = {
  __typename?: 'attendance_users';
  card?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** An array relationship */
  intervals: Array<Attendance_Intervals>;
  /** An aggregate relationship */
  intervals_aggregate: Attendance_Intervals_Aggregate;
  lastname?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "attendance.users" */
export type Attendance_UsersIntervalsArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


/** columns and relationships of "attendance.users" */
export type Attendance_UsersIntervals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};

/** aggregated selection of "attendance.users" */
export type Attendance_Users_Aggregate = {
  __typename?: 'attendance_users_aggregate';
  aggregate?: Maybe<Attendance_Users_Aggregate_Fields>;
  nodes: Array<Attendance_Users>;
};

/** aggregate fields of "attendance.users" */
export type Attendance_Users_Aggregate_Fields = {
  __typename?: 'attendance_users_aggregate_fields';
  avg?: Maybe<Attendance_Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Attendance_Users_Max_Fields>;
  min?: Maybe<Attendance_Users_Min_Fields>;
  stddev?: Maybe<Attendance_Users_Stddev_Fields>;
  stddev_pop?: Maybe<Attendance_Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Attendance_Users_Stddev_Samp_Fields>;
  sum?: Maybe<Attendance_Users_Sum_Fields>;
  var_pop?: Maybe<Attendance_Users_Var_Pop_Fields>;
  var_samp?: Maybe<Attendance_Users_Var_Samp_Fields>;
  variance?: Maybe<Attendance_Users_Variance_Fields>;
};


/** aggregate fields of "attendance.users" */
export type Attendance_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Attendance_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Attendance_Users_Avg_Fields = {
  __typename?: 'attendance_users_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "attendance.users". All fields are combined with a logical 'AND'. */
export type Attendance_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Attendance_Users_Bool_Exp>>;
  _not?: InputMaybe<Attendance_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Attendance_Users_Bool_Exp>>;
  card?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  firstname?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  intervals?: InputMaybe<Attendance_Intervals_Bool_Exp>;
  intervals_aggregate?: InputMaybe<Attendance_Intervals_Aggregate_Bool_Exp>;
  lastname?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "attendance.users" */
export enum Attendance_Users_Constraint {
  /** unique or primary key constraint on columns "card" */
  UniqueCard = 'unique_card',
  /** unique or primary key constraint on columns "card" */
  UsersCardKey = 'users_card_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** input type for incrementing numeric columns in table "attendance.users" */
export type Attendance_Users_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "attendance.users" */
export type Attendance_Users_Insert_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  intervals?: InputMaybe<Attendance_Intervals_Arr_Rel_Insert_Input>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Attendance_Users_Max_Fields = {
  __typename?: 'attendance_users_max_fields';
  card?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Attendance_Users_Min_Fields = {
  __typename?: 'attendance_users_min_fields';
  card?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "attendance.users" */
export type Attendance_Users_Mutation_Response = {
  __typename?: 'attendance_users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Attendance_Users>;
};

/** input type for inserting object relation for remote table "attendance.users" */
export type Attendance_Users_Obj_Rel_Insert_Input = {
  data: Attendance_Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Attendance_Users_On_Conflict>;
};

/** on_conflict condition type for table "attendance.users" */
export type Attendance_Users_On_Conflict = {
  constraint: Attendance_Users_Constraint;
  update_columns?: Array<Attendance_Users_Update_Column>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "attendance.users". */
export type Attendance_Users_Order_By = {
  card?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  firstname?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  intervals_aggregate?: InputMaybe<Attendance_Intervals_Aggregate_Order_By>;
  lastname?: InputMaybe<Order_By>;
};

/** primary key columns input for table: attendance.users */
export type Attendance_Users_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "attendance.users" */
export enum Attendance_Users_Select_Column {
  /** column name */
  Card = 'card',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Firstname = 'firstname',
  /** column name */
  Id = 'id',
  /** column name */
  Lastname = 'lastname'
}

/** input type for updating data in table "attendance.users" */
export type Attendance_Users_Set_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Attendance_Users_Stddev_Fields = {
  __typename?: 'attendance_users_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Attendance_Users_Stddev_Pop_Fields = {
  __typename?: 'attendance_users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Attendance_Users_Stddev_Samp_Fields = {
  __typename?: 'attendance_users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "attendance_users" */
export type Attendance_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Attendance_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Attendance_Users_Stream_Cursor_Value_Input = {
  card?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Attendance_Users_Sum_Fields = {
  __typename?: 'attendance_users_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "attendance.users" */
export enum Attendance_Users_Update_Column {
  /** column name */
  Card = 'card',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Firstname = 'firstname',
  /** column name */
  Id = 'id',
  /** column name */
  Lastname = 'lastname'
}

export type Attendance_Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Attendance_Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Attendance_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Attendance_Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Attendance_Users_Var_Pop_Fields = {
  __typename?: 'attendance_users_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Attendance_Users_Var_Samp_Fields = {
  __typename?: 'attendance_users_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Attendance_Users_Variance_Fields = {
  __typename?: 'attendance_users_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** columns and relationships of "erp.AccessLevels" */
export type Erp_AccessLevels = {
  __typename?: 'erp_AccessLevels';
  AccessLevelID: Scalars['Int']['output'];
  Name: Scalars['String']['output'];
  /** An array relationship */
  Users: Array<Erp_Users>;
  /** An aggregate relationship */
  Users_aggregate: Erp_Users_Aggregate;
};


/** columns and relationships of "erp.AccessLevels" */
export type Erp_AccessLevelsUsersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


/** columns and relationships of "erp.AccessLevels" */
export type Erp_AccessLevelsUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};

/** aggregated selection of "erp.AccessLevels" */
export type Erp_AccessLevels_Aggregate = {
  __typename?: 'erp_AccessLevels_aggregate';
  aggregate?: Maybe<Erp_AccessLevels_Aggregate_Fields>;
  nodes: Array<Erp_AccessLevels>;
};

/** aggregate fields of "erp.AccessLevels" */
export type Erp_AccessLevels_Aggregate_Fields = {
  __typename?: 'erp_AccessLevels_aggregate_fields';
  avg?: Maybe<Erp_AccessLevels_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_AccessLevels_Max_Fields>;
  min?: Maybe<Erp_AccessLevels_Min_Fields>;
  stddev?: Maybe<Erp_AccessLevels_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_AccessLevels_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_AccessLevels_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_AccessLevels_Sum_Fields>;
  var_pop?: Maybe<Erp_AccessLevels_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_AccessLevels_Var_Samp_Fields>;
  variance?: Maybe<Erp_AccessLevels_Variance_Fields>;
};


/** aggregate fields of "erp.AccessLevels" */
export type Erp_AccessLevels_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_AccessLevels_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Erp_AccessLevels_Avg_Fields = {
  __typename?: 'erp_AccessLevels_avg_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "erp.AccessLevels". All fields are combined with a logical 'AND'. */
export type Erp_AccessLevels_Bool_Exp = {
  AccessLevelID?: InputMaybe<Int_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Users?: InputMaybe<Erp_Users_Bool_Exp>;
  Users_aggregate?: InputMaybe<Erp_Users_Aggregate_Bool_Exp>;
  _and?: InputMaybe<Array<Erp_AccessLevels_Bool_Exp>>;
  _not?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_AccessLevels_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.AccessLevels" */
export enum Erp_AccessLevels_Constraint {
  /** unique or primary key constraint on columns "AccessLevelID" */
  AccessLevelsPkey = 'AccessLevels_pkey'
}

/** input type for incrementing numeric columns in table "erp.AccessLevels" */
export type Erp_AccessLevels_Inc_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.AccessLevels" */
export type Erp_AccessLevels_Insert_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Users?: InputMaybe<Erp_Users_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Erp_AccessLevels_Max_Fields = {
  __typename?: 'erp_AccessLevels_max_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Erp_AccessLevels_Min_Fields = {
  __typename?: 'erp_AccessLevels_min_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "erp.AccessLevels" */
export type Erp_AccessLevels_Mutation_Response = {
  __typename?: 'erp_AccessLevels_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_AccessLevels>;
};

/** input type for inserting object relation for remote table "erp.AccessLevels" */
export type Erp_AccessLevels_Obj_Rel_Insert_Input = {
  data: Erp_AccessLevels_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_AccessLevels_On_Conflict>;
};

/** on_conflict condition type for table "erp.AccessLevels" */
export type Erp_AccessLevels_On_Conflict = {
  constraint: Erp_AccessLevels_Constraint;
  update_columns?: Array<Erp_AccessLevels_Update_Column>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.AccessLevels". */
export type Erp_AccessLevels_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Users_aggregate?: InputMaybe<Erp_Users_Aggregate_Order_By>;
};

/** primary key columns input for table: erp.AccessLevels */
export type Erp_AccessLevels_Pk_Columns_Input = {
  AccessLevelID: Scalars['Int']['input'];
};

/** select columns of table "erp.AccessLevels" */
export enum Erp_AccessLevels_Select_Column {
  /** column name */
  AccessLevelId = 'AccessLevelID',
  /** column name */
  Name = 'Name'
}

/** input type for updating data in table "erp.AccessLevels" */
export type Erp_AccessLevels_Set_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Erp_AccessLevels_Stddev_Fields = {
  __typename?: 'erp_AccessLevels_stddev_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Erp_AccessLevels_Stddev_Pop_Fields = {
  __typename?: 'erp_AccessLevels_stddev_pop_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Erp_AccessLevels_Stddev_Samp_Fields = {
  __typename?: 'erp_AccessLevels_stddev_samp_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "erp_AccessLevels" */
export type Erp_AccessLevels_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_AccessLevels_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_AccessLevels_Stream_Cursor_Value_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Erp_AccessLevels_Sum_Fields = {
  __typename?: 'erp_AccessLevels_sum_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "erp.AccessLevels" */
export enum Erp_AccessLevels_Update_Column {
  /** column name */
  AccessLevelId = 'AccessLevelID',
  /** column name */
  Name = 'Name'
}

export type Erp_AccessLevels_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_AccessLevels_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_AccessLevels_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_AccessLevels_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_AccessLevels_Var_Pop_Fields = {
  __typename?: 'erp_AccessLevels_var_pop_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Erp_AccessLevels_Var_Samp_Fields = {
  __typename?: 'erp_AccessLevels_var_samp_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Erp_AccessLevels_Variance_Fields = {
  __typename?: 'erp_AccessLevels_variance_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "erp.Comments" */
export type Erp_Comments = {
  __typename?: 'erp_Comments';
  CommentID: Scalars['Int']['output'];
  /** An array relationship */
  Notifications: Array<Erp_Notifications>;
  /** An aggregate relationship */
  Notifications_aggregate: Erp_Notifications_Aggregate;
  /** An object relationship */
  Order: Erp_Orders;
  OrderID: Scalars['Int']['output'];
  Text: Scalars['String']['output'];
  Timestamp: Scalars['timestamptz']['output'];
  /** An object relationship */
  User: Erp_Users;
  UserID: Scalars['Int']['output'];
};


/** columns and relationships of "erp.Comments" */
export type Erp_CommentsNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


/** columns and relationships of "erp.Comments" */
export type Erp_CommentsNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};

/** aggregated selection of "erp.Comments" */
export type Erp_Comments_Aggregate = {
  __typename?: 'erp_Comments_aggregate';
  aggregate?: Maybe<Erp_Comments_Aggregate_Fields>;
  nodes: Array<Erp_Comments>;
};

export type Erp_Comments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_Comments_Aggregate_Bool_Exp_Count>;
};

export type Erp_Comments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Comments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Comments" */
export type Erp_Comments_Aggregate_Fields = {
  __typename?: 'erp_Comments_aggregate_fields';
  avg?: Maybe<Erp_Comments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Comments_Max_Fields>;
  min?: Maybe<Erp_Comments_Min_Fields>;
  stddev?: Maybe<Erp_Comments_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Comments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Comments_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Comments_Sum_Fields>;
  var_pop?: Maybe<Erp_Comments_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Comments_Var_Samp_Fields>;
  variance?: Maybe<Erp_Comments_Variance_Fields>;
};


/** aggregate fields of "erp.Comments" */
export type Erp_Comments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Comments" */
export type Erp_Comments_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Comments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Comments_Max_Order_By>;
  min?: InputMaybe<Erp_Comments_Min_Order_By>;
  stddev?: InputMaybe<Erp_Comments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Comments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Comments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Comments_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Comments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Comments_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Comments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Comments" */
export type Erp_Comments_Arr_Rel_Insert_Input = {
  data: Array<Erp_Comments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Comments_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Comments_Avg_Fields = {
  __typename?: 'erp_Comments_avg_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Comments" */
export type Erp_Comments_Avg_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Comments". All fields are combined with a logical 'AND'. */
export type Erp_Comments_Bool_Exp = {
  CommentID?: InputMaybe<Int_Comparison_Exp>;
  Notifications?: InputMaybe<Erp_Notifications_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp>;
  Order?: InputMaybe<Erp_Orders_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  Text?: InputMaybe<String_Comparison_Exp>;
  Timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  User?: InputMaybe<Erp_Users_Bool_Exp>;
  UserID?: InputMaybe<Int_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_Comments_Bool_Exp>>;
  _not?: InputMaybe<Erp_Comments_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Comments_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Comments" */
export enum Erp_Comments_Constraint {
  /** unique or primary key constraint on columns "CommentID" */
  CommentsPkey = 'Comments_pkey'
}

/** input type for incrementing numeric columns in table "erp.Comments" */
export type Erp_Comments_Inc_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.Comments" */
export type Erp_Comments_Insert_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  Notifications?: InputMaybe<Erp_Notifications_Arr_Rel_Insert_Input>;
  Order?: InputMaybe<Erp_Orders_Obj_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Text?: InputMaybe<Scalars['String']['input']>;
  Timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  User?: InputMaybe<Erp_Users_Obj_Rel_Insert_Input>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Erp_Comments_Max_Fields = {
  __typename?: 'erp_Comments_max_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  Text?: Maybe<Scalars['String']['output']>;
  Timestamp?: Maybe<Scalars['timestamptz']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "erp.Comments" */
export type Erp_Comments_Max_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Text?: InputMaybe<Order_By>;
  Timestamp?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Comments_Min_Fields = {
  __typename?: 'erp_Comments_min_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  Text?: Maybe<Scalars['String']['output']>;
  Timestamp?: Maybe<Scalars['timestamptz']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "erp.Comments" */
export type Erp_Comments_Min_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Text?: InputMaybe<Order_By>;
  Timestamp?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Comments" */
export type Erp_Comments_Mutation_Response = {
  __typename?: 'erp_Comments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Comments>;
};

/** input type for inserting object relation for remote table "erp.Comments" */
export type Erp_Comments_Obj_Rel_Insert_Input = {
  data: Erp_Comments_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Comments_On_Conflict>;
};

/** on_conflict condition type for table "erp.Comments" */
export type Erp_Comments_On_Conflict = {
  constraint: Erp_Comments_Constraint;
  update_columns?: Array<Erp_Comments_Update_Column>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Comments". */
export type Erp_Comments_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Order_By>;
  Order?: InputMaybe<Erp_Orders_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Text?: InputMaybe<Order_By>;
  Timestamp?: InputMaybe<Order_By>;
  User?: InputMaybe<Erp_Users_Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.Comments */
export type Erp_Comments_Pk_Columns_Input = {
  CommentID: Scalars['Int']['input'];
};

/** select columns of table "erp.Comments" */
export enum Erp_Comments_Select_Column {
  /** column name */
  CommentId = 'CommentID',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Text = 'Text',
  /** column name */
  Timestamp = 'Timestamp',
  /** column name */
  UserId = 'UserID'
}

/** input type for updating data in table "erp.Comments" */
export type Erp_Comments_Set_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Text?: InputMaybe<Scalars['String']['input']>;
  Timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Comments_Stddev_Fields = {
  __typename?: 'erp_Comments_stddev_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Comments" */
export type Erp_Comments_Stddev_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Comments_Stddev_Pop_Fields = {
  __typename?: 'erp_Comments_stddev_pop_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Comments" */
export type Erp_Comments_Stddev_Pop_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Comments_Stddev_Samp_Fields = {
  __typename?: 'erp_Comments_stddev_samp_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Comments" */
export type Erp_Comments_Stddev_Samp_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Comments" */
export type Erp_Comments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Comments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Comments_Stream_Cursor_Value_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Text?: InputMaybe<Scalars['String']['input']>;
  Timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Erp_Comments_Sum_Fields = {
  __typename?: 'erp_Comments_sum_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.Comments" */
export type Erp_Comments_Sum_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Comments" */
export enum Erp_Comments_Update_Column {
  /** column name */
  CommentId = 'CommentID',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Text = 'Text',
  /** column name */
  Timestamp = 'Timestamp',
  /** column name */
  UserId = 'UserID'
}

export type Erp_Comments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Comments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Comments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Comments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Comments_Var_Pop_Fields = {
  __typename?: 'erp_Comments_var_pop_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Comments" */
export type Erp_Comments_Var_Pop_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Comments_Var_Samp_Fields = {
  __typename?: 'erp_Comments_var_samp_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Comments" */
export type Erp_Comments_Var_Samp_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Comments_Variance_Fields = {
  __typename?: 'erp_Comments_variance_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Comments" */
export type Erp_Comments_Variance_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.Docs" */
export type Erp_Docs = {
  __typename?: 'erp_Docs';
  FileName?: Maybe<Scalars['String']['output']>;
  ID: Scalars['Int']['output'];
  Key: Scalars['String']['output'];
  /** An object relationship */
  Order: Erp_Orders;
  OrderID: Scalars['Int']['output'];
  Size?: Maybe<Scalars['Int']['output']>;
  UploadingDate?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregated selection of "erp.Docs" */
export type Erp_Docs_Aggregate = {
  __typename?: 'erp_Docs_aggregate';
  aggregate?: Maybe<Erp_Docs_Aggregate_Fields>;
  nodes: Array<Erp_Docs>;
};

export type Erp_Docs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_Docs_Aggregate_Bool_Exp_Count>;
};

export type Erp_Docs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Docs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Docs" */
export type Erp_Docs_Aggregate_Fields = {
  __typename?: 'erp_Docs_aggregate_fields';
  avg?: Maybe<Erp_Docs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Docs_Max_Fields>;
  min?: Maybe<Erp_Docs_Min_Fields>;
  stddev?: Maybe<Erp_Docs_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Docs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Docs_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Docs_Sum_Fields>;
  var_pop?: Maybe<Erp_Docs_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Docs_Var_Samp_Fields>;
  variance?: Maybe<Erp_Docs_Variance_Fields>;
};


/** aggregate fields of "erp.Docs" */
export type Erp_Docs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Docs" */
export type Erp_Docs_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Docs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Docs_Max_Order_By>;
  min?: InputMaybe<Erp_Docs_Min_Order_By>;
  stddev?: InputMaybe<Erp_Docs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Docs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Docs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Docs_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Docs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Docs_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Docs_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Docs" */
export type Erp_Docs_Arr_Rel_Insert_Input = {
  data: Array<Erp_Docs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Docs_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Docs_Avg_Fields = {
  __typename?: 'erp_Docs_avg_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Docs" */
export type Erp_Docs_Avg_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Docs". All fields are combined with a logical 'AND'. */
export type Erp_Docs_Bool_Exp = {
  FileName?: InputMaybe<String_Comparison_Exp>;
  ID?: InputMaybe<Int_Comparison_Exp>;
  Key?: InputMaybe<String_Comparison_Exp>;
  Order?: InputMaybe<Erp_Orders_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  Size?: InputMaybe<Int_Comparison_Exp>;
  UploadingDate?: InputMaybe<Timestamp_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_Docs_Bool_Exp>>;
  _not?: InputMaybe<Erp_Docs_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Docs_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Docs" */
export enum Erp_Docs_Constraint {
  /** unique or primary key constraint on columns "ID" */
  DocsIdKey = 'Docs_ID_key',
  /** unique or primary key constraint on columns "Key" */
  DocsKeyKey = 'Docs_Key_key',
  /** unique or primary key constraint on columns "ID" */
  DocsPkey = 'Docs_pkey'
}

/** input type for incrementing numeric columns in table "erp.Docs" */
export type Erp_Docs_Inc_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.Docs" */
export type Erp_Docs_Insert_Input = {
  FileName?: InputMaybe<Scalars['String']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  Key?: InputMaybe<Scalars['String']['input']>;
  Order?: InputMaybe<Erp_Orders_Obj_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Size?: InputMaybe<Scalars['Int']['input']>;
  UploadingDate?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Erp_Docs_Max_Fields = {
  __typename?: 'erp_Docs_max_fields';
  FileName?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  Key?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  Size?: Maybe<Scalars['Int']['output']>;
  UploadingDate?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "erp.Docs" */
export type Erp_Docs_Max_Order_By = {
  FileName?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  Key?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
  UploadingDate?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Docs_Min_Fields = {
  __typename?: 'erp_Docs_min_fields';
  FileName?: Maybe<Scalars['String']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  Key?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  Size?: Maybe<Scalars['Int']['output']>;
  UploadingDate?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "erp.Docs" */
export type Erp_Docs_Min_Order_By = {
  FileName?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  Key?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
  UploadingDate?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Docs" */
export type Erp_Docs_Mutation_Response = {
  __typename?: 'erp_Docs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Docs>;
};

/** on_conflict condition type for table "erp.Docs" */
export type Erp_Docs_On_Conflict = {
  constraint: Erp_Docs_Constraint;
  update_columns?: Array<Erp_Docs_Update_Column>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Docs". */
export type Erp_Docs_Order_By = {
  FileName?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  Key?: InputMaybe<Order_By>;
  Order?: InputMaybe<Erp_Orders_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
  UploadingDate?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.Docs */
export type Erp_Docs_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "erp.Docs" */
export enum Erp_Docs_Select_Column {
  /** column name */
  FileName = 'FileName',
  /** column name */
  Id = 'ID',
  /** column name */
  Key = 'Key',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Size = 'Size',
  /** column name */
  UploadingDate = 'UploadingDate'
}

/** input type for updating data in table "erp.Docs" */
export type Erp_Docs_Set_Input = {
  FileName?: InputMaybe<Scalars['String']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  Key?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Size?: InputMaybe<Scalars['Int']['input']>;
  UploadingDate?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Docs_Stddev_Fields = {
  __typename?: 'erp_Docs_stddev_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Docs" */
export type Erp_Docs_Stddev_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Docs_Stddev_Pop_Fields = {
  __typename?: 'erp_Docs_stddev_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Docs" */
export type Erp_Docs_Stddev_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Docs_Stddev_Samp_Fields = {
  __typename?: 'erp_Docs_stddev_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Docs" */
export type Erp_Docs_Stddev_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Docs" */
export type Erp_Docs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Docs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Docs_Stream_Cursor_Value_Input = {
  FileName?: InputMaybe<Scalars['String']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  Key?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Size?: InputMaybe<Scalars['Int']['input']>;
  UploadingDate?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Erp_Docs_Sum_Fields = {
  __typename?: 'erp_Docs_sum_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  Size?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.Docs" */
export type Erp_Docs_Sum_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Docs" */
export enum Erp_Docs_Update_Column {
  /** column name */
  FileName = 'FileName',
  /** column name */
  Id = 'ID',
  /** column name */
  Key = 'Key',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Size = 'Size',
  /** column name */
  UploadingDate = 'UploadingDate'
}

export type Erp_Docs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Docs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Docs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Docs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Docs_Var_Pop_Fields = {
  __typename?: 'erp_Docs_var_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Docs" */
export type Erp_Docs_Var_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Docs_Var_Samp_Fields = {
  __typename?: 'erp_Docs_var_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Docs" */
export type Erp_Docs_Var_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Docs_Variance_Fields = {
  __typename?: 'erp_Docs_variance_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  Size?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Docs" */
export type Erp_Docs_Variance_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  Size?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.Notifications" */
export type Erp_Notifications = {
  __typename?: 'erp_Notifications';
  /** An object relationship */
  Comment: Erp_Comments;
  CommentID: Scalars['Int']['output'];
  ID: Scalars['Int']['output'];
  MentionedUser?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  Order?: Maybe<Erp_Orders>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  User?: Maybe<Erp_Users>;
  Viewed: Scalars['Boolean']['output'];
};

/** aggregated selection of "erp.Notifications" */
export type Erp_Notifications_Aggregate = {
  __typename?: 'erp_Notifications_aggregate';
  aggregate?: Maybe<Erp_Notifications_Aggregate_Fields>;
  nodes: Array<Erp_Notifications>;
};

export type Erp_Notifications_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp_Count>;
};

export type Erp_Notifications_Aggregate_Bool_Exp_Bool_And = {
  arguments: Erp_Notifications_Select_Column_Erp_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Notifications_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Erp_Notifications_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Erp_Notifications_Select_Column_Erp_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Notifications_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Erp_Notifications_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Notifications_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Notifications" */
export type Erp_Notifications_Aggregate_Fields = {
  __typename?: 'erp_Notifications_aggregate_fields';
  avg?: Maybe<Erp_Notifications_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Notifications_Max_Fields>;
  min?: Maybe<Erp_Notifications_Min_Fields>;
  stddev?: Maybe<Erp_Notifications_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Notifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Notifications_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Notifications_Sum_Fields>;
  var_pop?: Maybe<Erp_Notifications_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Notifications_Var_Samp_Fields>;
  variance?: Maybe<Erp_Notifications_Variance_Fields>;
};


/** aggregate fields of "erp.Notifications" */
export type Erp_Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Notifications" */
export type Erp_Notifications_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Notifications_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Notifications_Max_Order_By>;
  min?: InputMaybe<Erp_Notifications_Min_Order_By>;
  stddev?: InputMaybe<Erp_Notifications_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Notifications_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Notifications_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Notifications_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Notifications_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Notifications_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Notifications_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Notifications" */
export type Erp_Notifications_Arr_Rel_Insert_Input = {
  data: Array<Erp_Notifications_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Notifications_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Notifications_Avg_Fields = {
  __typename?: 'erp_Notifications_avg_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Notifications" */
export type Erp_Notifications_Avg_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Notifications". All fields are combined with a logical 'AND'. */
export type Erp_Notifications_Bool_Exp = {
  Comment?: InputMaybe<Erp_Comments_Bool_Exp>;
  CommentID?: InputMaybe<Int_Comparison_Exp>;
  ID?: InputMaybe<Int_Comparison_Exp>;
  MentionedUser?: InputMaybe<Int_Comparison_Exp>;
  Order?: InputMaybe<Erp_Orders_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  User?: InputMaybe<Erp_Users_Bool_Exp>;
  Viewed?: InputMaybe<Boolean_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_Notifications_Bool_Exp>>;
  _not?: InputMaybe<Erp_Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Notifications_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Notifications" */
export enum Erp_Notifications_Constraint {
  /** unique or primary key constraint on columns "ID" */
  NotificationsPkey = 'Notifications_pkey'
}

/** input type for incrementing numeric columns in table "erp.Notifications" */
export type Erp_Notifications_Inc_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  MentionedUser?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.Notifications" */
export type Erp_Notifications_Insert_Input = {
  Comment?: InputMaybe<Erp_Comments_Obj_Rel_Insert_Input>;
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  MentionedUser?: InputMaybe<Scalars['Int']['input']>;
  Order?: InputMaybe<Erp_Orders_Obj_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  User?: InputMaybe<Erp_Users_Obj_Rel_Insert_Input>;
  Viewed?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate max on columns */
export type Erp_Notifications_Max_Fields = {
  __typename?: 'erp_Notifications_max_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  MentionedUser?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "erp.Notifications" */
export type Erp_Notifications_Max_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Notifications_Min_Fields = {
  __typename?: 'erp_Notifications_min_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  MentionedUser?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "erp.Notifications" */
export type Erp_Notifications_Min_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Notifications" */
export type Erp_Notifications_Mutation_Response = {
  __typename?: 'erp_Notifications_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Notifications>;
};

/** on_conflict condition type for table "erp.Notifications" */
export type Erp_Notifications_On_Conflict = {
  constraint: Erp_Notifications_Constraint;
  update_columns?: Array<Erp_Notifications_Update_Column>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Notifications". */
export type Erp_Notifications_Order_By = {
  Comment?: InputMaybe<Erp_Comments_Order_By>;
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  Order?: InputMaybe<Erp_Orders_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  User?: InputMaybe<Erp_Users_Order_By>;
  Viewed?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.Notifications */
export type Erp_Notifications_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "erp.Notifications" */
export enum Erp_Notifications_Select_Column {
  /** column name */
  CommentId = 'CommentID',
  /** column name */
  Id = 'ID',
  /** column name */
  MentionedUser = 'MentionedUser',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Viewed = 'Viewed'
}

/** select "erp_Notifications_aggregate_bool_exp_bool_and_arguments_columns" columns of table "erp.Notifications" */
export enum Erp_Notifications_Select_Column_Erp_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Viewed = 'Viewed'
}

/** select "erp_Notifications_aggregate_bool_exp_bool_or_arguments_columns" columns of table "erp.Notifications" */
export enum Erp_Notifications_Select_Column_Erp_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Viewed = 'Viewed'
}

/** input type for updating data in table "erp.Notifications" */
export type Erp_Notifications_Set_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  MentionedUser?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Viewed?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Notifications_Stddev_Fields = {
  __typename?: 'erp_Notifications_stddev_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Notifications" */
export type Erp_Notifications_Stddev_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Notifications_Stddev_Pop_Fields = {
  __typename?: 'erp_Notifications_stddev_pop_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Notifications" */
export type Erp_Notifications_Stddev_Pop_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Notifications_Stddev_Samp_Fields = {
  __typename?: 'erp_Notifications_stddev_samp_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Notifications" */
export type Erp_Notifications_Stddev_Samp_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Notifications" */
export type Erp_Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Notifications_Stream_Cursor_Value_Input = {
  CommentID?: InputMaybe<Scalars['Int']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  MentionedUser?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  Viewed?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate sum on columns */
export type Erp_Notifications_Sum_Fields = {
  __typename?: 'erp_Notifications_sum_fields';
  CommentID?: Maybe<Scalars['Int']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  MentionedUser?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.Notifications" */
export type Erp_Notifications_Sum_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Notifications" */
export enum Erp_Notifications_Update_Column {
  /** column name */
  CommentId = 'CommentID',
  /** column name */
  Id = 'ID',
  /** column name */
  MentionedUser = 'MentionedUser',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  Viewed = 'Viewed'
}

export type Erp_Notifications_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Notifications_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Notifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Notifications_Var_Pop_Fields = {
  __typename?: 'erp_Notifications_var_pop_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Notifications" */
export type Erp_Notifications_Var_Pop_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Notifications_Var_Samp_Fields = {
  __typename?: 'erp_Notifications_var_samp_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Notifications" */
export type Erp_Notifications_Var_Samp_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Notifications_Variance_Fields = {
  __typename?: 'erp_Notifications_variance_fields';
  CommentID?: Maybe<Scalars['Float']['output']>;
  ID?: Maybe<Scalars['Float']['output']>;
  MentionedUser?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Notifications" */
export type Erp_Notifications_Variance_Order_By = {
  CommentID?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  MentionedUser?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.OrderItems" */
export type Erp_OrderItems = {
  __typename?: 'erp_OrderItems';
  Fitter?: Maybe<Scalars['String']['output']>;
  FullName?: Maybe<Scalars['String']['output']>;
  Name: Scalars['String']['output'];
  /** An object relationship */
  Order: Erp_Orders;
  OrderID: Scalars['Int']['output'];
  OrderItemID: Scalars['Int']['output'];
  Quantity: Scalars['Int']['output'];
  SerialEnds?: Maybe<Scalars['String']['output']>;
  SerialStarts?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "erp.OrderItems" */
export type Erp_OrderItems_Aggregate = {
  __typename?: 'erp_OrderItems_aggregate';
  aggregate?: Maybe<Erp_OrderItems_Aggregate_Fields>;
  nodes: Array<Erp_OrderItems>;
};

export type Erp_OrderItems_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_OrderItems_Aggregate_Bool_Exp_Count>;
};

export type Erp_OrderItems_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_OrderItems_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.OrderItems" */
export type Erp_OrderItems_Aggregate_Fields = {
  __typename?: 'erp_OrderItems_aggregate_fields';
  avg?: Maybe<Erp_OrderItems_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_OrderItems_Max_Fields>;
  min?: Maybe<Erp_OrderItems_Min_Fields>;
  stddev?: Maybe<Erp_OrderItems_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_OrderItems_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_OrderItems_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_OrderItems_Sum_Fields>;
  var_pop?: Maybe<Erp_OrderItems_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_OrderItems_Var_Samp_Fields>;
  variance?: Maybe<Erp_OrderItems_Variance_Fields>;
};


/** aggregate fields of "erp.OrderItems" */
export type Erp_OrderItems_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.OrderItems" */
export type Erp_OrderItems_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_OrderItems_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_OrderItems_Max_Order_By>;
  min?: InputMaybe<Erp_OrderItems_Min_Order_By>;
  stddev?: InputMaybe<Erp_OrderItems_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_OrderItems_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_OrderItems_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_OrderItems_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_OrderItems_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_OrderItems_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_OrderItems_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.OrderItems" */
export type Erp_OrderItems_Arr_Rel_Insert_Input = {
  data: Array<Erp_OrderItems_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_OrderItems_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_OrderItems_Avg_Fields = {
  __typename?: 'erp_OrderItems_avg_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Avg_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.OrderItems". All fields are combined with a logical 'AND'. */
export type Erp_OrderItems_Bool_Exp = {
  Fitter?: InputMaybe<String_Comparison_Exp>;
  FullName?: InputMaybe<String_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Order?: InputMaybe<Erp_Orders_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  OrderItemID?: InputMaybe<Int_Comparison_Exp>;
  Quantity?: InputMaybe<Int_Comparison_Exp>;
  SerialEnds?: InputMaybe<String_Comparison_Exp>;
  SerialStarts?: InputMaybe<String_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_OrderItems_Bool_Exp>>;
  _not?: InputMaybe<Erp_OrderItems_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_OrderItems_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.OrderItems" */
export enum Erp_OrderItems_Constraint {
  /** unique or primary key constraint on columns "OrderItemID" */
  OrderItemsPkey = 'OrderItems_pkey'
}

/** input type for incrementing numeric columns in table "erp.OrderItems" */
export type Erp_OrderItems_Inc_Input = {
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderItemID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.OrderItems" */
export type Erp_OrderItems_Insert_Input = {
  Fitter?: InputMaybe<Scalars['String']['input']>;
  FullName?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Order?: InputMaybe<Erp_Orders_Obj_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderItemID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Int']['input']>;
  SerialEnds?: InputMaybe<Scalars['String']['input']>;
  SerialStarts?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Erp_OrderItems_Max_Fields = {
  __typename?: 'erp_OrderItems_max_fields';
  Fitter?: Maybe<Scalars['String']['output']>;
  FullName?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderItemID?: Maybe<Scalars['Int']['output']>;
  Quantity?: Maybe<Scalars['Int']['output']>;
  SerialEnds?: Maybe<Scalars['String']['output']>;
  SerialStarts?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Max_Order_By = {
  Fitter?: InputMaybe<Order_By>;
  FullName?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
  SerialEnds?: InputMaybe<Order_By>;
  SerialStarts?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_OrderItems_Min_Fields = {
  __typename?: 'erp_OrderItems_min_fields';
  Fitter?: Maybe<Scalars['String']['output']>;
  FullName?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderItemID?: Maybe<Scalars['Int']['output']>;
  Quantity?: Maybe<Scalars['Int']['output']>;
  SerialEnds?: Maybe<Scalars['String']['output']>;
  SerialStarts?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Min_Order_By = {
  Fitter?: InputMaybe<Order_By>;
  FullName?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
  SerialEnds?: InputMaybe<Order_By>;
  SerialStarts?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.OrderItems" */
export type Erp_OrderItems_Mutation_Response = {
  __typename?: 'erp_OrderItems_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_OrderItems>;
};

/** on_conflict condition type for table "erp.OrderItems" */
export type Erp_OrderItems_On_Conflict = {
  constraint: Erp_OrderItems_Constraint;
  update_columns?: Array<Erp_OrderItems_Update_Column>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.OrderItems". */
export type Erp_OrderItems_Order_By = {
  Fitter?: InputMaybe<Order_By>;
  FullName?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Order?: InputMaybe<Erp_Orders_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
  SerialEnds?: InputMaybe<Order_By>;
  SerialStarts?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.OrderItems */
export type Erp_OrderItems_Pk_Columns_Input = {
  OrderItemID: Scalars['Int']['input'];
};

/** select columns of table "erp.OrderItems" */
export enum Erp_OrderItems_Select_Column {
  /** column name */
  Fitter = 'Fitter',
  /** column name */
  FullName = 'FullName',
  /** column name */
  Name = 'Name',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  OrderItemId = 'OrderItemID',
  /** column name */
  Quantity = 'Quantity',
  /** column name */
  SerialEnds = 'SerialEnds',
  /** column name */
  SerialStarts = 'SerialStarts'
}

/** input type for updating data in table "erp.OrderItems" */
export type Erp_OrderItems_Set_Input = {
  Fitter?: InputMaybe<Scalars['String']['input']>;
  FullName?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderItemID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Int']['input']>;
  SerialEnds?: InputMaybe<Scalars['String']['input']>;
  SerialStarts?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Erp_OrderItems_Stddev_Fields = {
  __typename?: 'erp_OrderItems_stddev_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Stddev_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_OrderItems_Stddev_Pop_Fields = {
  __typename?: 'erp_OrderItems_stddev_pop_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Stddev_Pop_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_OrderItems_Stddev_Samp_Fields = {
  __typename?: 'erp_OrderItems_stddev_samp_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Stddev_Samp_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_OrderItems" */
export type Erp_OrderItems_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_OrderItems_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_OrderItems_Stream_Cursor_Value_Input = {
  Fitter?: InputMaybe<Scalars['String']['input']>;
  FullName?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderItemID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Int']['input']>;
  SerialEnds?: InputMaybe<Scalars['String']['input']>;
  SerialStarts?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Erp_OrderItems_Sum_Fields = {
  __typename?: 'erp_OrderItems_sum_fields';
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderItemID?: Maybe<Scalars['Int']['output']>;
  Quantity?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Sum_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** update columns of table "erp.OrderItems" */
export enum Erp_OrderItems_Update_Column {
  /** column name */
  Fitter = 'Fitter',
  /** column name */
  FullName = 'FullName',
  /** column name */
  Name = 'Name',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  OrderItemId = 'OrderItemID',
  /** column name */
  Quantity = 'Quantity',
  /** column name */
  SerialEnds = 'SerialEnds',
  /** column name */
  SerialStarts = 'SerialStarts'
}

export type Erp_OrderItems_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_OrderItems_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_OrderItems_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_OrderItems_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_OrderItems_Var_Pop_Fields = {
  __typename?: 'erp_OrderItems_var_pop_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Var_Pop_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_OrderItems_Var_Samp_Fields = {
  __typename?: 'erp_OrderItems_var_samp_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Var_Samp_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_OrderItems_Variance_Fields = {
  __typename?: 'erp_OrderItems_variance_fields';
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderItemID?: Maybe<Scalars['Float']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.OrderItems" */
export type Erp_OrderItems_Variance_Order_By = {
  OrderID?: InputMaybe<Order_By>;
  OrderItemID?: InputMaybe<Order_By>;
  Quantity?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.OrderStatus" */
export type Erp_OrderStatus = {
  __typename?: 'erp_OrderStatus';
  ID: Scalars['Int']['output'];
  Name: Scalars['String']['output'];
  /** An array relationship */
  Orders: Array<Erp_Orders>;
  /** An aggregate relationship */
  Orders_aggregate: Erp_Orders_Aggregate;
};


/** columns and relationships of "erp.OrderStatus" */
export type Erp_OrderStatusOrdersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


/** columns and relationships of "erp.OrderStatus" */
export type Erp_OrderStatusOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};

/** aggregated selection of "erp.OrderStatus" */
export type Erp_OrderStatus_Aggregate = {
  __typename?: 'erp_OrderStatus_aggregate';
  aggregate?: Maybe<Erp_OrderStatus_Aggregate_Fields>;
  nodes: Array<Erp_OrderStatus>;
};

/** aggregate fields of "erp.OrderStatus" */
export type Erp_OrderStatus_Aggregate_Fields = {
  __typename?: 'erp_OrderStatus_aggregate_fields';
  avg?: Maybe<Erp_OrderStatus_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_OrderStatus_Max_Fields>;
  min?: Maybe<Erp_OrderStatus_Min_Fields>;
  stddev?: Maybe<Erp_OrderStatus_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_OrderStatus_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_OrderStatus_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_OrderStatus_Sum_Fields>;
  var_pop?: Maybe<Erp_OrderStatus_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_OrderStatus_Var_Samp_Fields>;
  variance?: Maybe<Erp_OrderStatus_Variance_Fields>;
};


/** aggregate fields of "erp.OrderStatus" */
export type Erp_OrderStatus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_OrderStatus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Erp_OrderStatus_Avg_Fields = {
  __typename?: 'erp_OrderStatus_avg_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "erp.OrderStatus". All fields are combined with a logical 'AND'. */
export type Erp_OrderStatus_Bool_Exp = {
  ID?: InputMaybe<Int_Comparison_Exp>;
  Name?: InputMaybe<String_Comparison_Exp>;
  Orders?: InputMaybe<Erp_Orders_Bool_Exp>;
  Orders_aggregate?: InputMaybe<Erp_Orders_Aggregate_Bool_Exp>;
  _and?: InputMaybe<Array<Erp_OrderStatus_Bool_Exp>>;
  _not?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_OrderStatus_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.OrderStatus" */
export enum Erp_OrderStatus_Constraint {
  /** unique or primary key constraint on columns "ID" */
  OrderStatusPkey = 'OrderStatus_pkey'
}

/** input type for incrementing numeric columns in table "erp.OrderStatus" */
export type Erp_OrderStatus_Inc_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.OrderStatus" */
export type Erp_OrderStatus_Insert_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Orders?: InputMaybe<Erp_Orders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Erp_OrderStatus_Max_Fields = {
  __typename?: 'erp_OrderStatus_max_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Erp_OrderStatus_Min_Fields = {
  __typename?: 'erp_OrderStatus_min_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "erp.OrderStatus" */
export type Erp_OrderStatus_Mutation_Response = {
  __typename?: 'erp_OrderStatus_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_OrderStatus>;
};

/** input type for inserting object relation for remote table "erp.OrderStatus" */
export type Erp_OrderStatus_Obj_Rel_Insert_Input = {
  data: Erp_OrderStatus_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_OrderStatus_On_Conflict>;
};

/** on_conflict condition type for table "erp.OrderStatus" */
export type Erp_OrderStatus_On_Conflict = {
  constraint: Erp_OrderStatus_Constraint;
  update_columns?: Array<Erp_OrderStatus_Update_Column>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.OrderStatus". */
export type Erp_OrderStatus_Order_By = {
  ID?: InputMaybe<Order_By>;
  Name?: InputMaybe<Order_By>;
  Orders_aggregate?: InputMaybe<Erp_Orders_Aggregate_Order_By>;
};

/** primary key columns input for table: erp.OrderStatus */
export type Erp_OrderStatus_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "erp.OrderStatus" */
export enum Erp_OrderStatus_Select_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  Name = 'Name'
}

/** input type for updating data in table "erp.OrderStatus" */
export type Erp_OrderStatus_Set_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Erp_OrderStatus_Stddev_Fields = {
  __typename?: 'erp_OrderStatus_stddev_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Erp_OrderStatus_Stddev_Pop_Fields = {
  __typename?: 'erp_OrderStatus_stddev_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Erp_OrderStatus_Stddev_Samp_Fields = {
  __typename?: 'erp_OrderStatus_stddev_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "erp_OrderStatus" */
export type Erp_OrderStatus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_OrderStatus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_OrderStatus_Stream_Cursor_Value_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Erp_OrderStatus_Sum_Fields = {
  __typename?: 'erp_OrderStatus_sum_fields';
  ID?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "erp.OrderStatus" */
export enum Erp_OrderStatus_Update_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  Name = 'Name'
}

export type Erp_OrderStatus_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_OrderStatus_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_OrderStatus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_OrderStatus_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_OrderStatus_Var_Pop_Fields = {
  __typename?: 'erp_OrderStatus_var_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Erp_OrderStatus_Var_Samp_Fields = {
  __typename?: 'erp_OrderStatus_var_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Erp_OrderStatus_Variance_Fields = {
  __typename?: 'erp_OrderStatus_variance_fields';
  ID?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "erp.Orders" */
export type Erp_Orders = {
  __typename?: 'erp_Orders';
  AcceptanceDate?: Maybe<Scalars['timestamp']['output']>;
  ActualShippingDate?: Maybe<Scalars['timestamp']['output']>;
  AwaitingDispatch: Scalars['Boolean']['output'];
  CheckListTPLID?: Maybe<Scalars['Int']['output']>;
  City?: Maybe<Scalars['String']['output']>;
  Comment?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  Comments: Array<Erp_Comments>;
  /** An aggregate relationship */
  Comments_aggregate: Erp_Comments_Aggregate;
  CreatingDate: Scalars['timestamp']['output'];
  /** An array relationship */
  Docs: Array<Erp_Docs>;
  /** An aggregate relationship */
  Docs_aggregate: Erp_Docs_Aggregate;
  Entity?: Maybe<Scalars['String']['output']>;
  InvoiceNumber?: Maybe<Scalars['String']['output']>;
  IsReclamation?: Maybe<Scalars['Boolean']['output']>;
  ManagerID?: Maybe<Scalars['Int']['output']>;
  NeedAttention?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  Notifications: Array<Erp_Notifications>;
  /** An aggregate relationship */
  Notifications_aggregate: Erp_Notifications_Aggregate;
  OrderID: Scalars['Int']['output'];
  /** An array relationship */
  OrderItems: Array<Erp_OrderItems>;
  /** An aggregate relationship */
  OrderItems_aggregate: Erp_OrderItems_Aggregate;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  OrderStatus: Erp_OrderStatus;
  OrderStatusID: Scalars['Int']['output'];
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
  /** An array relationship */
  PaymentHistories: Array<Erp_PaymentHistory>;
  /** An aggregate relationship */
  PaymentHistories_aggregate: Erp_PaymentHistory_Aggregate;
  ShippingDate?: Maybe<Scalars['date']['output']>;
  TotalAmount?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  User?: Maybe<Erp_Users>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersCommentsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersComments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersDocsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersDocs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersOrderItemsArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersOrderItems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersPaymentHistoriesArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


/** columns and relationships of "erp.Orders" */
export type Erp_OrdersPaymentHistories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};

/** aggregated selection of "erp.Orders" */
export type Erp_Orders_Aggregate = {
  __typename?: 'erp_Orders_aggregate';
  aggregate?: Maybe<Erp_Orders_Aggregate_Fields>;
  nodes: Array<Erp_Orders>;
};

export type Erp_Orders_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Erp_Orders_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Erp_Orders_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Erp_Orders_Aggregate_Bool_Exp_Count>;
};

export type Erp_Orders_Aggregate_Bool_Exp_Bool_And = {
  arguments: Erp_Orders_Select_Column_Erp_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Erp_Orders_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Erp_Orders_Select_Column_Erp_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Erp_Orders_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Orders_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Orders" */
export type Erp_Orders_Aggregate_Fields = {
  __typename?: 'erp_Orders_aggregate_fields';
  avg?: Maybe<Erp_Orders_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Orders_Max_Fields>;
  min?: Maybe<Erp_Orders_Min_Fields>;
  stddev?: Maybe<Erp_Orders_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Orders_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Orders_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Orders_Sum_Fields>;
  var_pop?: Maybe<Erp_Orders_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Orders_Var_Samp_Fields>;
  variance?: Maybe<Erp_Orders_Variance_Fields>;
};


/** aggregate fields of "erp.Orders" */
export type Erp_Orders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Orders" */
export type Erp_Orders_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Orders_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Orders_Max_Order_By>;
  min?: InputMaybe<Erp_Orders_Min_Order_By>;
  stddev?: InputMaybe<Erp_Orders_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Orders_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Orders_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Orders_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Orders_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Orders_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Orders_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Orders" */
export type Erp_Orders_Arr_Rel_Insert_Input = {
  data: Array<Erp_Orders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Orders_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Orders_Avg_Fields = {
  __typename?: 'erp_Orders_avg_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Orders" */
export type Erp_Orders_Avg_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Orders". All fields are combined with a logical 'AND'. */
export type Erp_Orders_Bool_Exp = {
  AcceptanceDate?: InputMaybe<Timestamp_Comparison_Exp>;
  ActualShippingDate?: InputMaybe<Timestamp_Comparison_Exp>;
  AwaitingDispatch?: InputMaybe<Boolean_Comparison_Exp>;
  CheckListTPLID?: InputMaybe<Int_Comparison_Exp>;
  City?: InputMaybe<String_Comparison_Exp>;
  Comment?: InputMaybe<String_Comparison_Exp>;
  Comments?: InputMaybe<Erp_Comments_Bool_Exp>;
  Comments_aggregate?: InputMaybe<Erp_Comments_Aggregate_Bool_Exp>;
  CreatingDate?: InputMaybe<Timestamp_Comparison_Exp>;
  Docs?: InputMaybe<Erp_Docs_Bool_Exp>;
  Docs_aggregate?: InputMaybe<Erp_Docs_Aggregate_Bool_Exp>;
  Entity?: InputMaybe<String_Comparison_Exp>;
  InvoiceNumber?: InputMaybe<String_Comparison_Exp>;
  IsReclamation?: InputMaybe<Boolean_Comparison_Exp>;
  ManagerID?: InputMaybe<Int_Comparison_Exp>;
  NeedAttention?: InputMaybe<String_Comparison_Exp>;
  Notifications?: InputMaybe<Erp_Notifications_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  OrderItems?: InputMaybe<Erp_OrderItems_Bool_Exp>;
  OrderItems_aggregate?: InputMaybe<Erp_OrderItems_Aggregate_Bool_Exp>;
  OrderNumber?: InputMaybe<String_Comparison_Exp>;
  OrderStatus?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
  OrderStatusID?: InputMaybe<Int_Comparison_Exp>;
  PaidAmount?: InputMaybe<Numeric_Comparison_Exp>;
  PaymentHistories?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
  PaymentHistories_aggregate?: InputMaybe<Erp_PaymentHistory_Aggregate_Bool_Exp>;
  ShippingDate?: InputMaybe<Date_Comparison_Exp>;
  TotalAmount?: InputMaybe<Numeric_Comparison_Exp>;
  User?: InputMaybe<Erp_Users_Bool_Exp>;
  _and?: InputMaybe<Array<Erp_Orders_Bool_Exp>>;
  _not?: InputMaybe<Erp_Orders_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Orders_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Orders" */
export enum Erp_Orders_Constraint {
  /** unique or primary key constraint on columns "OrderID" */
  OrdersPkey = 'Orders_pkey'
}

/** input type for incrementing numeric columns in table "erp.Orders" */
export type Erp_Orders_Inc_Input = {
  CheckListTPLID?: InputMaybe<Scalars['Int']['input']>;
  ManagerID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderStatusID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
  TotalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "erp.Orders" */
export type Erp_Orders_Insert_Input = {
  AcceptanceDate?: InputMaybe<Scalars['timestamp']['input']>;
  ActualShippingDate?: InputMaybe<Scalars['timestamp']['input']>;
  AwaitingDispatch?: InputMaybe<Scalars['Boolean']['input']>;
  CheckListTPLID?: InputMaybe<Scalars['Int']['input']>;
  City?: InputMaybe<Scalars['String']['input']>;
  Comment?: InputMaybe<Scalars['String']['input']>;
  Comments?: InputMaybe<Erp_Comments_Arr_Rel_Insert_Input>;
  CreatingDate?: InputMaybe<Scalars['timestamp']['input']>;
  Docs?: InputMaybe<Erp_Docs_Arr_Rel_Insert_Input>;
  Entity?: InputMaybe<Scalars['String']['input']>;
  InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  IsReclamation?: InputMaybe<Scalars['Boolean']['input']>;
  ManagerID?: InputMaybe<Scalars['Int']['input']>;
  NeedAttention?: InputMaybe<Scalars['String']['input']>;
  Notifications?: InputMaybe<Erp_Notifications_Arr_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderItems?: InputMaybe<Erp_OrderItems_Arr_Rel_Insert_Input>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  OrderStatus?: InputMaybe<Erp_OrderStatus_Obj_Rel_Insert_Input>;
  OrderStatusID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
  PaymentHistories?: InputMaybe<Erp_PaymentHistory_Arr_Rel_Insert_Input>;
  ShippingDate?: InputMaybe<Scalars['date']['input']>;
  TotalAmount?: InputMaybe<Scalars['numeric']['input']>;
  User?: InputMaybe<Erp_Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Erp_Orders_Max_Fields = {
  __typename?: 'erp_Orders_max_fields';
  AcceptanceDate?: Maybe<Scalars['timestamp']['output']>;
  ActualShippingDate?: Maybe<Scalars['timestamp']['output']>;
  CheckListTPLID?: Maybe<Scalars['Int']['output']>;
  City?: Maybe<Scalars['String']['output']>;
  Comment?: Maybe<Scalars['String']['output']>;
  CreatingDate?: Maybe<Scalars['timestamp']['output']>;
  Entity?: Maybe<Scalars['String']['output']>;
  InvoiceNumber?: Maybe<Scalars['String']['output']>;
  ManagerID?: Maybe<Scalars['Int']['output']>;
  NeedAttention?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  OrderStatusID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
  ShippingDate?: Maybe<Scalars['date']['output']>;
  TotalAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "erp.Orders" */
export type Erp_Orders_Max_Order_By = {
  AcceptanceDate?: InputMaybe<Order_By>;
  ActualShippingDate?: InputMaybe<Order_By>;
  CheckListTPLID?: InputMaybe<Order_By>;
  City?: InputMaybe<Order_By>;
  Comment?: InputMaybe<Order_By>;
  CreatingDate?: InputMaybe<Order_By>;
  Entity?: InputMaybe<Order_By>;
  InvoiceNumber?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  NeedAttention?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderNumber?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  ShippingDate?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Orders_Min_Fields = {
  __typename?: 'erp_Orders_min_fields';
  AcceptanceDate?: Maybe<Scalars['timestamp']['output']>;
  ActualShippingDate?: Maybe<Scalars['timestamp']['output']>;
  CheckListTPLID?: Maybe<Scalars['Int']['output']>;
  City?: Maybe<Scalars['String']['output']>;
  Comment?: Maybe<Scalars['String']['output']>;
  CreatingDate?: Maybe<Scalars['timestamp']['output']>;
  Entity?: Maybe<Scalars['String']['output']>;
  InvoiceNumber?: Maybe<Scalars['String']['output']>;
  ManagerID?: Maybe<Scalars['Int']['output']>;
  NeedAttention?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  OrderStatusID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
  ShippingDate?: Maybe<Scalars['date']['output']>;
  TotalAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "erp.Orders" */
export type Erp_Orders_Min_Order_By = {
  AcceptanceDate?: InputMaybe<Order_By>;
  ActualShippingDate?: InputMaybe<Order_By>;
  CheckListTPLID?: InputMaybe<Order_By>;
  City?: InputMaybe<Order_By>;
  Comment?: InputMaybe<Order_By>;
  CreatingDate?: InputMaybe<Order_By>;
  Entity?: InputMaybe<Order_By>;
  InvoiceNumber?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  NeedAttention?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderNumber?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  ShippingDate?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Orders" */
export type Erp_Orders_Mutation_Response = {
  __typename?: 'erp_Orders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Orders>;
};

/** input type for inserting object relation for remote table "erp.Orders" */
export type Erp_Orders_Obj_Rel_Insert_Input = {
  data: Erp_Orders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Orders_On_Conflict>;
};

/** on_conflict condition type for table "erp.Orders" */
export type Erp_Orders_On_Conflict = {
  constraint: Erp_Orders_Constraint;
  update_columns?: Array<Erp_Orders_Update_Column>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Orders". */
export type Erp_Orders_Order_By = {
  AcceptanceDate?: InputMaybe<Order_By>;
  ActualShippingDate?: InputMaybe<Order_By>;
  AwaitingDispatch?: InputMaybe<Order_By>;
  CheckListTPLID?: InputMaybe<Order_By>;
  City?: InputMaybe<Order_By>;
  Comment?: InputMaybe<Order_By>;
  Comments_aggregate?: InputMaybe<Erp_Comments_Aggregate_Order_By>;
  CreatingDate?: InputMaybe<Order_By>;
  Docs_aggregate?: InputMaybe<Erp_Docs_Aggregate_Order_By>;
  Entity?: InputMaybe<Order_By>;
  InvoiceNumber?: InputMaybe<Order_By>;
  IsReclamation?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  NeedAttention?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderItems_aggregate?: InputMaybe<Erp_OrderItems_Aggregate_Order_By>;
  OrderNumber?: InputMaybe<Order_By>;
  OrderStatus?: InputMaybe<Erp_OrderStatus_Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  PaymentHistories_aggregate?: InputMaybe<Erp_PaymentHistory_Aggregate_Order_By>;
  ShippingDate?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
  User?: InputMaybe<Erp_Users_Order_By>;
};

/** primary key columns input for table: erp.Orders */
export type Erp_Orders_Pk_Columns_Input = {
  OrderID: Scalars['Int']['input'];
};

/** select columns of table "erp.Orders" */
export enum Erp_Orders_Select_Column {
  /** column name */
  AcceptanceDate = 'AcceptanceDate',
  /** column name */
  ActualShippingDate = 'ActualShippingDate',
  /** column name */
  AwaitingDispatch = 'AwaitingDispatch',
  /** column name */
  CheckListTplid = 'CheckListTPLID',
  /** column name */
  City = 'City',
  /** column name */
  Comment = 'Comment',
  /** column name */
  CreatingDate = 'CreatingDate',
  /** column name */
  Entity = 'Entity',
  /** column name */
  InvoiceNumber = 'InvoiceNumber',
  /** column name */
  IsReclamation = 'IsReclamation',
  /** column name */
  ManagerId = 'ManagerID',
  /** column name */
  NeedAttention = 'NeedAttention',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  OrderNumber = 'OrderNumber',
  /** column name */
  OrderStatusId = 'OrderStatusID',
  /** column name */
  PaidAmount = 'PaidAmount',
  /** column name */
  ShippingDate = 'ShippingDate',
  /** column name */
  TotalAmount = 'TotalAmount'
}

/** select "erp_Orders_aggregate_bool_exp_bool_and_arguments_columns" columns of table "erp.Orders" */
export enum Erp_Orders_Select_Column_Erp_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  AwaitingDispatch = 'AwaitingDispatch',
  /** column name */
  IsReclamation = 'IsReclamation'
}

/** select "erp_Orders_aggregate_bool_exp_bool_or_arguments_columns" columns of table "erp.Orders" */
export enum Erp_Orders_Select_Column_Erp_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  AwaitingDispatch = 'AwaitingDispatch',
  /** column name */
  IsReclamation = 'IsReclamation'
}

/** input type for updating data in table "erp.Orders" */
export type Erp_Orders_Set_Input = {
  AcceptanceDate?: InputMaybe<Scalars['timestamp']['input']>;
  ActualShippingDate?: InputMaybe<Scalars['timestamp']['input']>;
  AwaitingDispatch?: InputMaybe<Scalars['Boolean']['input']>;
  CheckListTPLID?: InputMaybe<Scalars['Int']['input']>;
  City?: InputMaybe<Scalars['String']['input']>;
  Comment?: InputMaybe<Scalars['String']['input']>;
  CreatingDate?: InputMaybe<Scalars['timestamp']['input']>;
  Entity?: InputMaybe<Scalars['String']['input']>;
  InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  IsReclamation?: InputMaybe<Scalars['Boolean']['input']>;
  ManagerID?: InputMaybe<Scalars['Int']['input']>;
  NeedAttention?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  OrderStatusID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
  ShippingDate?: InputMaybe<Scalars['date']['input']>;
  TotalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Orders_Stddev_Fields = {
  __typename?: 'erp_Orders_stddev_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Orders" */
export type Erp_Orders_Stddev_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Orders_Stddev_Pop_Fields = {
  __typename?: 'erp_Orders_stddev_pop_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Orders" */
export type Erp_Orders_Stddev_Pop_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Orders_Stddev_Samp_Fields = {
  __typename?: 'erp_Orders_stddev_samp_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Orders" */
export type Erp_Orders_Stddev_Samp_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Orders" */
export type Erp_Orders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Orders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Orders_Stream_Cursor_Value_Input = {
  AcceptanceDate?: InputMaybe<Scalars['timestamp']['input']>;
  ActualShippingDate?: InputMaybe<Scalars['timestamp']['input']>;
  AwaitingDispatch?: InputMaybe<Scalars['Boolean']['input']>;
  CheckListTPLID?: InputMaybe<Scalars['Int']['input']>;
  City?: InputMaybe<Scalars['String']['input']>;
  Comment?: InputMaybe<Scalars['String']['input']>;
  CreatingDate?: InputMaybe<Scalars['timestamp']['input']>;
  Entity?: InputMaybe<Scalars['String']['input']>;
  InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  IsReclamation?: InputMaybe<Scalars['Boolean']['input']>;
  ManagerID?: InputMaybe<Scalars['Int']['input']>;
  NeedAttention?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  OrderStatusID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
  ShippingDate?: InputMaybe<Scalars['date']['input']>;
  TotalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Erp_Orders_Sum_Fields = {
  __typename?: 'erp_Orders_sum_fields';
  CheckListTPLID?: Maybe<Scalars['Int']['output']>;
  ManagerID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderStatusID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
  TotalAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "erp.Orders" */
export type Erp_Orders_Sum_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Orders" */
export enum Erp_Orders_Update_Column {
  /** column name */
  AcceptanceDate = 'AcceptanceDate',
  /** column name */
  ActualShippingDate = 'ActualShippingDate',
  /** column name */
  AwaitingDispatch = 'AwaitingDispatch',
  /** column name */
  CheckListTplid = 'CheckListTPLID',
  /** column name */
  City = 'City',
  /** column name */
  Comment = 'Comment',
  /** column name */
  CreatingDate = 'CreatingDate',
  /** column name */
  Entity = 'Entity',
  /** column name */
  InvoiceNumber = 'InvoiceNumber',
  /** column name */
  IsReclamation = 'IsReclamation',
  /** column name */
  ManagerId = 'ManagerID',
  /** column name */
  NeedAttention = 'NeedAttention',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  OrderNumber = 'OrderNumber',
  /** column name */
  OrderStatusId = 'OrderStatusID',
  /** column name */
  PaidAmount = 'PaidAmount',
  /** column name */
  ShippingDate = 'ShippingDate',
  /** column name */
  TotalAmount = 'TotalAmount'
}

export type Erp_Orders_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Orders_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Orders_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Orders_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Orders_Var_Pop_Fields = {
  __typename?: 'erp_Orders_var_pop_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Orders" */
export type Erp_Orders_Var_Pop_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Orders_Var_Samp_Fields = {
  __typename?: 'erp_Orders_var_samp_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Orders" */
export type Erp_Orders_Var_Samp_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Orders_Variance_Fields = {
  __typename?: 'erp_Orders_variance_fields';
  CheckListTPLID?: Maybe<Scalars['Float']['output']>;
  ManagerID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  OrderStatusID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
  TotalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Orders" */
export type Erp_Orders_Variance_Order_By = {
  CheckListTPLID?: InputMaybe<Order_By>;
  ManagerID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  OrderStatusID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
  TotalAmount?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.PaymentHistory" */
export type Erp_PaymentHistory = {
  __typename?: 'erp_PaymentHistory';
  Date: Scalars['timestamp']['output'];
  ID: Scalars['Int']['output'];
  /** An object relationship */
  Order: Erp_Orders;
  OrderID: Scalars['Int']['output'];
  PaidAmount: Scalars['numeric']['output'];
};

/** aggregated selection of "erp.PaymentHistory" */
export type Erp_PaymentHistory_Aggregate = {
  __typename?: 'erp_PaymentHistory_aggregate';
  aggregate?: Maybe<Erp_PaymentHistory_Aggregate_Fields>;
  nodes: Array<Erp_PaymentHistory>;
};

export type Erp_PaymentHistory_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_PaymentHistory_Aggregate_Bool_Exp_Count>;
};

export type Erp_PaymentHistory_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.PaymentHistory" */
export type Erp_PaymentHistory_Aggregate_Fields = {
  __typename?: 'erp_PaymentHistory_aggregate_fields';
  avg?: Maybe<Erp_PaymentHistory_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_PaymentHistory_Max_Fields>;
  min?: Maybe<Erp_PaymentHistory_Min_Fields>;
  stddev?: Maybe<Erp_PaymentHistory_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_PaymentHistory_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_PaymentHistory_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_PaymentHistory_Sum_Fields>;
  var_pop?: Maybe<Erp_PaymentHistory_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_PaymentHistory_Var_Samp_Fields>;
  variance?: Maybe<Erp_PaymentHistory_Variance_Fields>;
};


/** aggregate fields of "erp.PaymentHistory" */
export type Erp_PaymentHistory_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_PaymentHistory_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_PaymentHistory_Max_Order_By>;
  min?: InputMaybe<Erp_PaymentHistory_Min_Order_By>;
  stddev?: InputMaybe<Erp_PaymentHistory_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_PaymentHistory_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_PaymentHistory_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_PaymentHistory_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_PaymentHistory_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_PaymentHistory_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_PaymentHistory_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Arr_Rel_Insert_Input = {
  data: Array<Erp_PaymentHistory_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_PaymentHistory_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_PaymentHistory_Avg_Fields = {
  __typename?: 'erp_PaymentHistory_avg_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Avg_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.PaymentHistory". All fields are combined with a logical 'AND'. */
export type Erp_PaymentHistory_Bool_Exp = {
  Date?: InputMaybe<Timestamp_Comparison_Exp>;
  ID?: InputMaybe<Int_Comparison_Exp>;
  Order?: InputMaybe<Erp_Orders_Bool_Exp>;
  OrderID?: InputMaybe<Int_Comparison_Exp>;
  PaidAmount?: InputMaybe<Numeric_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_PaymentHistory_Bool_Exp>>;
  _not?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_PaymentHistory_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.PaymentHistory" */
export enum Erp_PaymentHistory_Constraint {
  /** unique or primary key constraint on columns "ID" */
  PaymentHistoryIdKey = 'PaymentHistory_id_key',
  /** unique or primary key constraint on columns "ID" */
  PaymentHistoryPkey = 'PaymentHistory_pkey'
}

/** input type for incrementing numeric columns in table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Inc_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Insert_Input = {
  Date?: InputMaybe<Scalars['timestamp']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  Order?: InputMaybe<Erp_Orders_Obj_Rel_Insert_Input>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type Erp_PaymentHistory_Max_Fields = {
  __typename?: 'erp_PaymentHistory_max_fields';
  Date?: Maybe<Scalars['timestamp']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Max_Order_By = {
  Date?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_PaymentHistory_Min_Fields = {
  __typename?: 'erp_PaymentHistory_min_fields';
  Date?: Maybe<Scalars['timestamp']['output']>;
  ID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Min_Order_By = {
  Date?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Mutation_Response = {
  __typename?: 'erp_PaymentHistory_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_PaymentHistory>;
};

/** on_conflict condition type for table "erp.PaymentHistory" */
export type Erp_PaymentHistory_On_Conflict = {
  constraint: Erp_PaymentHistory_Constraint;
  update_columns?: Array<Erp_PaymentHistory_Update_Column>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.PaymentHistory". */
export type Erp_PaymentHistory_Order_By = {
  Date?: InputMaybe<Order_By>;
  ID?: InputMaybe<Order_By>;
  Order?: InputMaybe<Erp_Orders_Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.PaymentHistory */
export type Erp_PaymentHistory_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "erp.PaymentHistory" */
export enum Erp_PaymentHistory_Select_Column {
  /** column name */
  Date = 'Date',
  /** column name */
  Id = 'ID',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  PaidAmount = 'PaidAmount'
}

/** input type for updating data in table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Set_Input = {
  Date?: InputMaybe<Scalars['timestamp']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Erp_PaymentHistory_Stddev_Fields = {
  __typename?: 'erp_PaymentHistory_stddev_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Stddev_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_PaymentHistory_Stddev_Pop_Fields = {
  __typename?: 'erp_PaymentHistory_stddev_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Stddev_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_PaymentHistory_Stddev_Samp_Fields = {
  __typename?: 'erp_PaymentHistory_stddev_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Stddev_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_PaymentHistory" */
export type Erp_PaymentHistory_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_PaymentHistory_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_PaymentHistory_Stream_Cursor_Value_Input = {
  Date?: InputMaybe<Scalars['timestamp']['input']>;
  ID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  PaidAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Erp_PaymentHistory_Sum_Fields = {
  __typename?: 'erp_PaymentHistory_sum_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  PaidAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Sum_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** update columns of table "erp.PaymentHistory" */
export enum Erp_PaymentHistory_Update_Column {
  /** column name */
  Date = 'Date',
  /** column name */
  Id = 'ID',
  /** column name */
  OrderId = 'OrderID',
  /** column name */
  PaidAmount = 'PaidAmount'
}

export type Erp_PaymentHistory_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_PaymentHistory_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_PaymentHistory_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_PaymentHistory_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_PaymentHistory_Var_Pop_Fields = {
  __typename?: 'erp_PaymentHistory_var_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Var_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_PaymentHistory_Var_Samp_Fields = {
  __typename?: 'erp_PaymentHistory_var_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Var_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_PaymentHistory_Variance_Fields = {
  __typename?: 'erp_PaymentHistory_variance_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  OrderID?: Maybe<Scalars['Float']['output']>;
  PaidAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.PaymentHistory" */
export type Erp_PaymentHistory_Variance_Order_By = {
  ID?: InputMaybe<Order_By>;
  OrderID?: InputMaybe<Order_By>;
  PaidAmount?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.Tokens" */
export type Erp_Tokens = {
  __typename?: 'erp_Tokens';
  ID: Scalars['Int']['output'];
  RefreshToken: Scalars['String']['output'];
  /** An object relationship */
  User: Erp_Users;
  UserID: Scalars['Int']['output'];
};

/** aggregated selection of "erp.Tokens" */
export type Erp_Tokens_Aggregate = {
  __typename?: 'erp_Tokens_aggregate';
  aggregate?: Maybe<Erp_Tokens_Aggregate_Fields>;
  nodes: Array<Erp_Tokens>;
};

export type Erp_Tokens_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_Tokens_Aggregate_Bool_Exp_Count>;
};

export type Erp_Tokens_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Tokens_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Tokens" */
export type Erp_Tokens_Aggregate_Fields = {
  __typename?: 'erp_Tokens_aggregate_fields';
  avg?: Maybe<Erp_Tokens_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Tokens_Max_Fields>;
  min?: Maybe<Erp_Tokens_Min_Fields>;
  stddev?: Maybe<Erp_Tokens_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Tokens_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Tokens_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Tokens_Sum_Fields>;
  var_pop?: Maybe<Erp_Tokens_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Tokens_Var_Samp_Fields>;
  variance?: Maybe<Erp_Tokens_Variance_Fields>;
};


/** aggregate fields of "erp.Tokens" */
export type Erp_Tokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Tokens" */
export type Erp_Tokens_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Tokens_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Tokens_Max_Order_By>;
  min?: InputMaybe<Erp_Tokens_Min_Order_By>;
  stddev?: InputMaybe<Erp_Tokens_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Tokens_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Tokens_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Tokens_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Tokens_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Tokens_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Tokens_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Tokens" */
export type Erp_Tokens_Arr_Rel_Insert_Input = {
  data: Array<Erp_Tokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Tokens_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Tokens_Avg_Fields = {
  __typename?: 'erp_Tokens_avg_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Tokens" */
export type Erp_Tokens_Avg_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Tokens". All fields are combined with a logical 'AND'. */
export type Erp_Tokens_Bool_Exp = {
  ID?: InputMaybe<Int_Comparison_Exp>;
  RefreshToken?: InputMaybe<String_Comparison_Exp>;
  User?: InputMaybe<Erp_Users_Bool_Exp>;
  UserID?: InputMaybe<Int_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_Tokens_Bool_Exp>>;
  _not?: InputMaybe<Erp_Tokens_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Tokens_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Tokens" */
export enum Erp_Tokens_Constraint {
  /** unique or primary key constraint on columns "ID" */
  TokrnsPkey = 'Tokrns_pkey'
}

/** input type for incrementing numeric columns in table "erp.Tokens" */
export type Erp_Tokens_Inc_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.Tokens" */
export type Erp_Tokens_Insert_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  RefreshToken?: InputMaybe<Scalars['String']['input']>;
  User?: InputMaybe<Erp_Users_Obj_Rel_Insert_Input>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Erp_Tokens_Max_Fields = {
  __typename?: 'erp_Tokens_max_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  RefreshToken?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "erp.Tokens" */
export type Erp_Tokens_Max_Order_By = {
  ID?: InputMaybe<Order_By>;
  RefreshToken?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Tokens_Min_Fields = {
  __typename?: 'erp_Tokens_min_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  RefreshToken?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "erp.Tokens" */
export type Erp_Tokens_Min_Order_By = {
  ID?: InputMaybe<Order_By>;
  RefreshToken?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Tokens" */
export type Erp_Tokens_Mutation_Response = {
  __typename?: 'erp_Tokens_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Tokens>;
};

/** on_conflict condition type for table "erp.Tokens" */
export type Erp_Tokens_On_Conflict = {
  constraint: Erp_Tokens_Constraint;
  update_columns?: Array<Erp_Tokens_Update_Column>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Tokens". */
export type Erp_Tokens_Order_By = {
  ID?: InputMaybe<Order_By>;
  RefreshToken?: InputMaybe<Order_By>;
  User?: InputMaybe<Erp_Users_Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.Tokens */
export type Erp_Tokens_Pk_Columns_Input = {
  ID: Scalars['Int']['input'];
};

/** select columns of table "erp.Tokens" */
export enum Erp_Tokens_Select_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  RefreshToken = 'RefreshToken',
  /** column name */
  UserId = 'UserID'
}

/** input type for updating data in table "erp.Tokens" */
export type Erp_Tokens_Set_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  RefreshToken?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Tokens_Stddev_Fields = {
  __typename?: 'erp_Tokens_stddev_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Tokens" */
export type Erp_Tokens_Stddev_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Tokens_Stddev_Pop_Fields = {
  __typename?: 'erp_Tokens_stddev_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Tokens" */
export type Erp_Tokens_Stddev_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Tokens_Stddev_Samp_Fields = {
  __typename?: 'erp_Tokens_stddev_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Tokens" */
export type Erp_Tokens_Stddev_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Tokens" */
export type Erp_Tokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Tokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Tokens_Stream_Cursor_Value_Input = {
  ID?: InputMaybe<Scalars['Int']['input']>;
  RefreshToken?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Erp_Tokens_Sum_Fields = {
  __typename?: 'erp_Tokens_sum_fields';
  ID?: Maybe<Scalars['Int']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.Tokens" */
export type Erp_Tokens_Sum_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Tokens" */
export enum Erp_Tokens_Update_Column {
  /** column name */
  Id = 'ID',
  /** column name */
  RefreshToken = 'RefreshToken',
  /** column name */
  UserId = 'UserID'
}

export type Erp_Tokens_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Tokens_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Tokens_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Tokens_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Tokens_Var_Pop_Fields = {
  __typename?: 'erp_Tokens_var_pop_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Tokens" */
export type Erp_Tokens_Var_Pop_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Tokens_Var_Samp_Fields = {
  __typename?: 'erp_Tokens_var_samp_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Tokens" */
export type Erp_Tokens_Var_Samp_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Tokens_Variance_Fields = {
  __typename?: 'erp_Tokens_variance_fields';
  ID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Tokens" */
export type Erp_Tokens_Variance_Order_By = {
  ID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** columns and relationships of "erp.Users" */
export type Erp_Users = {
  __typename?: 'erp_Users';
  /** An object relationship */
  AccessLevel?: Maybe<Erp_AccessLevels>;
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  Comments: Array<Erp_Comments>;
  /** An aggregate relationship */
  Comments_aggregate: Erp_Comments_Aggregate;
  Email?: Maybe<Scalars['String']['output']>;
  FirstName?: Maybe<Scalars['String']['output']>;
  LastName?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  Notifications: Array<Erp_Notifications>;
  /** An aggregate relationship */
  Notifications_aggregate: Erp_Notifications_Aggregate;
  /** An array relationship */
  Orders: Array<Erp_Orders>;
  /** An aggregate relationship */
  Orders_aggregate: Erp_Orders_Aggregate;
  Password?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  Tokens: Array<Erp_Tokens>;
  /** An aggregate relationship */
  Tokens_aggregate: Erp_Tokens_Aggregate;
  UserID: Scalars['Int']['output'];
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersCommentsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersComments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersOrdersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersTokensArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


/** columns and relationships of "erp.Users" */
export type Erp_UsersTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};

/** aggregated selection of "erp.Users" */
export type Erp_Users_Aggregate = {
  __typename?: 'erp_Users_aggregate';
  aggregate?: Maybe<Erp_Users_Aggregate_Fields>;
  nodes: Array<Erp_Users>;
};

export type Erp_Users_Aggregate_Bool_Exp = {
  count?: InputMaybe<Erp_Users_Aggregate_Bool_Exp_Count>;
};

export type Erp_Users_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Erp_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Erp_Users_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "erp.Users" */
export type Erp_Users_Aggregate_Fields = {
  __typename?: 'erp_Users_aggregate_fields';
  avg?: Maybe<Erp_Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Erp_Users_Max_Fields>;
  min?: Maybe<Erp_Users_Min_Fields>;
  stddev?: Maybe<Erp_Users_Stddev_Fields>;
  stddev_pop?: Maybe<Erp_Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Erp_Users_Stddev_Samp_Fields>;
  sum?: Maybe<Erp_Users_Sum_Fields>;
  var_pop?: Maybe<Erp_Users_Var_Pop_Fields>;
  var_samp?: Maybe<Erp_Users_Var_Samp_Fields>;
  variance?: Maybe<Erp_Users_Variance_Fields>;
};


/** aggregate fields of "erp.Users" */
export type Erp_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Erp_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "erp.Users" */
export type Erp_Users_Aggregate_Order_By = {
  avg?: InputMaybe<Erp_Users_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Erp_Users_Max_Order_By>;
  min?: InputMaybe<Erp_Users_Min_Order_By>;
  stddev?: InputMaybe<Erp_Users_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Erp_Users_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Erp_Users_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Erp_Users_Sum_Order_By>;
  var_pop?: InputMaybe<Erp_Users_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Erp_Users_Var_Samp_Order_By>;
  variance?: InputMaybe<Erp_Users_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "erp.Users" */
export type Erp_Users_Arr_Rel_Insert_Input = {
  data: Array<Erp_Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Users_On_Conflict>;
};

/** aggregate avg on columns */
export type Erp_Users_Avg_Fields = {
  __typename?: 'erp_Users_avg_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "erp.Users" */
export type Erp_Users_Avg_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "erp.Users". All fields are combined with a logical 'AND'. */
export type Erp_Users_Bool_Exp = {
  AccessLevel?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
  AccessLevelID?: InputMaybe<Int_Comparison_Exp>;
  Comments?: InputMaybe<Erp_Comments_Bool_Exp>;
  Comments_aggregate?: InputMaybe<Erp_Comments_Aggregate_Bool_Exp>;
  Email?: InputMaybe<String_Comparison_Exp>;
  FirstName?: InputMaybe<String_Comparison_Exp>;
  LastName?: InputMaybe<String_Comparison_Exp>;
  Notifications?: InputMaybe<Erp_Notifications_Bool_Exp>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Bool_Exp>;
  Orders?: InputMaybe<Erp_Orders_Bool_Exp>;
  Orders_aggregate?: InputMaybe<Erp_Orders_Aggregate_Bool_Exp>;
  Password?: InputMaybe<String_Comparison_Exp>;
  Tokens?: InputMaybe<Erp_Tokens_Bool_Exp>;
  Tokens_aggregate?: InputMaybe<Erp_Tokens_Aggregate_Bool_Exp>;
  UserID?: InputMaybe<Int_Comparison_Exp>;
  _and?: InputMaybe<Array<Erp_Users_Bool_Exp>>;
  _not?: InputMaybe<Erp_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Erp_Users_Bool_Exp>>;
};

/** unique or primary key constraints on table "erp.Users" */
export enum Erp_Users_Constraint {
  /** unique or primary key constraint on columns "UserID" */
  UsersPkey = 'Users_pkey'
}

/** input type for incrementing numeric columns in table "erp.Users" */
export type Erp_Users_Inc_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "erp.Users" */
export type Erp_Users_Insert_Input = {
  AccessLevel?: InputMaybe<Erp_AccessLevels_Obj_Rel_Insert_Input>;
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Comments?: InputMaybe<Erp_Comments_Arr_Rel_Insert_Input>;
  Email?: InputMaybe<Scalars['String']['input']>;
  FirstName?: InputMaybe<Scalars['String']['input']>;
  LastName?: InputMaybe<Scalars['String']['input']>;
  Notifications?: InputMaybe<Erp_Notifications_Arr_Rel_Insert_Input>;
  Orders?: InputMaybe<Erp_Orders_Arr_Rel_Insert_Input>;
  Password?: InputMaybe<Scalars['String']['input']>;
  Tokens?: InputMaybe<Erp_Tokens_Arr_Rel_Insert_Input>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Erp_Users_Max_Fields = {
  __typename?: 'erp_Users_max_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  Email?: Maybe<Scalars['String']['output']>;
  FirstName?: Maybe<Scalars['String']['output']>;
  LastName?: Maybe<Scalars['String']['output']>;
  Password?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "erp.Users" */
export type Erp_Users_Max_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  Email?: InputMaybe<Order_By>;
  FirstName?: InputMaybe<Order_By>;
  LastName?: InputMaybe<Order_By>;
  Password?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Erp_Users_Min_Fields = {
  __typename?: 'erp_Users_min_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  Email?: Maybe<Scalars['String']['output']>;
  FirstName?: Maybe<Scalars['String']['output']>;
  LastName?: Maybe<Scalars['String']['output']>;
  Password?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "erp.Users" */
export type Erp_Users_Min_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  Email?: InputMaybe<Order_By>;
  FirstName?: InputMaybe<Order_By>;
  LastName?: InputMaybe<Order_By>;
  Password?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "erp.Users" */
export type Erp_Users_Mutation_Response = {
  __typename?: 'erp_Users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Erp_Users>;
};

/** input type for inserting object relation for remote table "erp.Users" */
export type Erp_Users_Obj_Rel_Insert_Input = {
  data: Erp_Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Erp_Users_On_Conflict>;
};

/** on_conflict condition type for table "erp.Users" */
export type Erp_Users_On_Conflict = {
  constraint: Erp_Users_Constraint;
  update_columns?: Array<Erp_Users_Update_Column>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "erp.Users". */
export type Erp_Users_Order_By = {
  AccessLevel?: InputMaybe<Erp_AccessLevels_Order_By>;
  AccessLevelID?: InputMaybe<Order_By>;
  Comments_aggregate?: InputMaybe<Erp_Comments_Aggregate_Order_By>;
  Email?: InputMaybe<Order_By>;
  FirstName?: InputMaybe<Order_By>;
  LastName?: InputMaybe<Order_By>;
  Notifications_aggregate?: InputMaybe<Erp_Notifications_Aggregate_Order_By>;
  Orders_aggregate?: InputMaybe<Erp_Orders_Aggregate_Order_By>;
  Password?: InputMaybe<Order_By>;
  Tokens_aggregate?: InputMaybe<Erp_Tokens_Aggregate_Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** primary key columns input for table: erp.Users */
export type Erp_Users_Pk_Columns_Input = {
  UserID: Scalars['Int']['input'];
};

/** select columns of table "erp.Users" */
export enum Erp_Users_Select_Column {
  /** column name */
  AccessLevelId = 'AccessLevelID',
  /** column name */
  Email = 'Email',
  /** column name */
  FirstName = 'FirstName',
  /** column name */
  LastName = 'LastName',
  /** column name */
  Password = 'Password',
  /** column name */
  UserId = 'UserID'
}

/** input type for updating data in table "erp.Users" */
export type Erp_Users_Set_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Email?: InputMaybe<Scalars['String']['input']>;
  FirstName?: InputMaybe<Scalars['String']['input']>;
  LastName?: InputMaybe<Scalars['String']['input']>;
  Password?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Erp_Users_Stddev_Fields = {
  __typename?: 'erp_Users_stddev_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "erp.Users" */
export type Erp_Users_Stddev_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Erp_Users_Stddev_Pop_Fields = {
  __typename?: 'erp_Users_stddev_pop_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "erp.Users" */
export type Erp_Users_Stddev_Pop_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Erp_Users_Stddev_Samp_Fields = {
  __typename?: 'erp_Users_stddev_samp_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "erp.Users" */
export type Erp_Users_Stddev_Samp_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "erp_Users" */
export type Erp_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Erp_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Erp_Users_Stream_Cursor_Value_Input = {
  AccessLevelID?: InputMaybe<Scalars['Int']['input']>;
  Email?: InputMaybe<Scalars['String']['input']>;
  FirstName?: InputMaybe<Scalars['String']['input']>;
  LastName?: InputMaybe<Scalars['String']['input']>;
  Password?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Erp_Users_Sum_Fields = {
  __typename?: 'erp_Users_sum_fields';
  AccessLevelID?: Maybe<Scalars['Int']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "erp.Users" */
export type Erp_Users_Sum_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** update columns of table "erp.Users" */
export enum Erp_Users_Update_Column {
  /** column name */
  AccessLevelId = 'AccessLevelID',
  /** column name */
  Email = 'Email',
  /** column name */
  FirstName = 'FirstName',
  /** column name */
  LastName = 'LastName',
  /** column name */
  Password = 'Password',
  /** column name */
  UserId = 'UserID'
}

export type Erp_Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Erp_Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Erp_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Erp_Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Erp_Users_Var_Pop_Fields = {
  __typename?: 'erp_Users_var_pop_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "erp.Users" */
export type Erp_Users_Var_Pop_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Erp_Users_Var_Samp_Fields = {
  __typename?: 'erp_Users_var_samp_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "erp.Users" */
export type Erp_Users_Var_Samp_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Erp_Users_Variance_Fields = {
  __typename?: 'erp_Users_variance_fields';
  AccessLevelID?: Maybe<Scalars['Float']['output']>;
  UserID?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "erp.Users" */
export type Erp_Users_Variance_Order_By = {
  AccessLevelID?: InputMaybe<Order_By>;
  UserID?: InputMaybe<Order_By>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "kysely_migration" */
export type Kysely_Migration = {
  __typename?: 'kysely_migration';
  name: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

/** aggregated selection of "kysely_migration" */
export type Kysely_Migration_Aggregate = {
  __typename?: 'kysely_migration_aggregate';
  aggregate?: Maybe<Kysely_Migration_Aggregate_Fields>;
  nodes: Array<Kysely_Migration>;
};

/** aggregate fields of "kysely_migration" */
export type Kysely_Migration_Aggregate_Fields = {
  __typename?: 'kysely_migration_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Kysely_Migration_Max_Fields>;
  min?: Maybe<Kysely_Migration_Min_Fields>;
};


/** aggregate fields of "kysely_migration" */
export type Kysely_Migration_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Kysely_Migration_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "kysely_migration". All fields are combined with a logical 'AND'. */
export type Kysely_Migration_Bool_Exp = {
  _and?: InputMaybe<Array<Kysely_Migration_Bool_Exp>>;
  _not?: InputMaybe<Kysely_Migration_Bool_Exp>;
  _or?: InputMaybe<Array<Kysely_Migration_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "kysely_migration" */
export enum Kysely_Migration_Constraint {
  /** unique or primary key constraint on columns "name" */
  KyselyMigrationPkey = 'kysely_migration_pkey'
}

/** input type for inserting data into table "kysely_migration" */
export type Kysely_Migration_Insert_Input = {
  name?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "kysely_migration_lock" */
export type Kysely_Migration_Lock = {
  __typename?: 'kysely_migration_lock';
  id: Scalars['String']['output'];
  is_locked: Scalars['Int']['output'];
};

/** aggregated selection of "kysely_migration_lock" */
export type Kysely_Migration_Lock_Aggregate = {
  __typename?: 'kysely_migration_lock_aggregate';
  aggregate?: Maybe<Kysely_Migration_Lock_Aggregate_Fields>;
  nodes: Array<Kysely_Migration_Lock>;
};

/** aggregate fields of "kysely_migration_lock" */
export type Kysely_Migration_Lock_Aggregate_Fields = {
  __typename?: 'kysely_migration_lock_aggregate_fields';
  avg?: Maybe<Kysely_Migration_Lock_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Kysely_Migration_Lock_Max_Fields>;
  min?: Maybe<Kysely_Migration_Lock_Min_Fields>;
  stddev?: Maybe<Kysely_Migration_Lock_Stddev_Fields>;
  stddev_pop?: Maybe<Kysely_Migration_Lock_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Kysely_Migration_Lock_Stddev_Samp_Fields>;
  sum?: Maybe<Kysely_Migration_Lock_Sum_Fields>;
  var_pop?: Maybe<Kysely_Migration_Lock_Var_Pop_Fields>;
  var_samp?: Maybe<Kysely_Migration_Lock_Var_Samp_Fields>;
  variance?: Maybe<Kysely_Migration_Lock_Variance_Fields>;
};


/** aggregate fields of "kysely_migration_lock" */
export type Kysely_Migration_Lock_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Kysely_Migration_Lock_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Kysely_Migration_Lock_Avg_Fields = {
  __typename?: 'kysely_migration_lock_avg_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "kysely_migration_lock". All fields are combined with a logical 'AND'. */
export type Kysely_Migration_Lock_Bool_Exp = {
  _and?: InputMaybe<Array<Kysely_Migration_Lock_Bool_Exp>>;
  _not?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
  _or?: InputMaybe<Array<Kysely_Migration_Lock_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_locked?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "kysely_migration_lock" */
export enum Kysely_Migration_Lock_Constraint {
  /** unique or primary key constraint on columns "id" */
  KyselyMigrationLockPkey = 'kysely_migration_lock_pkey'
}

/** input type for incrementing numeric columns in table "kysely_migration_lock" */
export type Kysely_Migration_Lock_Inc_Input = {
  is_locked?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "kysely_migration_lock" */
export type Kysely_Migration_Lock_Insert_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
  is_locked?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Kysely_Migration_Lock_Max_Fields = {
  __typename?: 'kysely_migration_lock_max_fields';
  id?: Maybe<Scalars['String']['output']>;
  is_locked?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Kysely_Migration_Lock_Min_Fields = {
  __typename?: 'kysely_migration_lock_min_fields';
  id?: Maybe<Scalars['String']['output']>;
  is_locked?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "kysely_migration_lock" */
export type Kysely_Migration_Lock_Mutation_Response = {
  __typename?: 'kysely_migration_lock_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Kysely_Migration_Lock>;
};

/** on_conflict condition type for table "kysely_migration_lock" */
export type Kysely_Migration_Lock_On_Conflict = {
  constraint: Kysely_Migration_Lock_Constraint;
  update_columns?: Array<Kysely_Migration_Lock_Update_Column>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};

/** Ordering options when selecting data from "kysely_migration_lock". */
export type Kysely_Migration_Lock_Order_By = {
  id?: InputMaybe<Order_By>;
  is_locked?: InputMaybe<Order_By>;
};

/** primary key columns input for table: kysely_migration_lock */
export type Kysely_Migration_Lock_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "kysely_migration_lock" */
export enum Kysely_Migration_Lock_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsLocked = 'is_locked'
}

/** input type for updating data in table "kysely_migration_lock" */
export type Kysely_Migration_Lock_Set_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
  is_locked?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Kysely_Migration_Lock_Stddev_Fields = {
  __typename?: 'kysely_migration_lock_stddev_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Kysely_Migration_Lock_Stddev_Pop_Fields = {
  __typename?: 'kysely_migration_lock_stddev_pop_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Kysely_Migration_Lock_Stddev_Samp_Fields = {
  __typename?: 'kysely_migration_lock_stddev_samp_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "kysely_migration_lock" */
export type Kysely_Migration_Lock_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Kysely_Migration_Lock_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Kysely_Migration_Lock_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
  is_locked?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Kysely_Migration_Lock_Sum_Fields = {
  __typename?: 'kysely_migration_lock_sum_fields';
  is_locked?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "kysely_migration_lock" */
export enum Kysely_Migration_Lock_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsLocked = 'is_locked'
}

export type Kysely_Migration_Lock_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Kysely_Migration_Lock_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Kysely_Migration_Lock_Set_Input>;
  /** filter the rows which have to be updated */
  where: Kysely_Migration_Lock_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Kysely_Migration_Lock_Var_Pop_Fields = {
  __typename?: 'kysely_migration_lock_var_pop_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Kysely_Migration_Lock_Var_Samp_Fields = {
  __typename?: 'kysely_migration_lock_var_samp_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Kysely_Migration_Lock_Variance_Fields = {
  __typename?: 'kysely_migration_lock_variance_fields';
  is_locked?: Maybe<Scalars['Float']['output']>;
};

/** aggregate max on columns */
export type Kysely_Migration_Max_Fields = {
  __typename?: 'kysely_migration_max_fields';
  name?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Kysely_Migration_Min_Fields = {
  __typename?: 'kysely_migration_min_fields';
  name?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "kysely_migration" */
export type Kysely_Migration_Mutation_Response = {
  __typename?: 'kysely_migration_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Kysely_Migration>;
};

/** on_conflict condition type for table "kysely_migration" */
export type Kysely_Migration_On_Conflict = {
  constraint: Kysely_Migration_Constraint;
  update_columns?: Array<Kysely_Migration_Update_Column>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};

/** Ordering options when selecting data from "kysely_migration". */
export type Kysely_Migration_Order_By = {
  name?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** primary key columns input for table: kysely_migration */
export type Kysely_Migration_Pk_Columns_Input = {
  name: Scalars['String']['input'];
};

/** select columns of table "kysely_migration" */
export enum Kysely_Migration_Select_Column {
  /** column name */
  Name = 'name',
  /** column name */
  Timestamp = 'timestamp'
}

/** input type for updating data in table "kysely_migration" */
export type Kysely_Migration_Set_Input = {
  name?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "kysely_migration" */
export type Kysely_Migration_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Kysely_Migration_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Kysely_Migration_Stream_Cursor_Value_Input = {
  name?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "kysely_migration" */
export enum Kysely_Migration_Update_Column {
  /** column name */
  Name = 'name',
  /** column name */
  Timestamp = 'timestamp'
}

export type Kysely_Migration_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Kysely_Migration_Set_Input>;
  /** filter the rows which have to be updated */
  where: Kysely_Migration_Bool_Exp;
};

/** columns and relationships of "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials = {
  __typename?: 'metal_pdo_detail_materials';
  cost?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  detail: Metal_Pdo_Details;
  detail_id: Scalars['Int']['output'];
  /** An object relationship */
  material: Metal_Pdo_Materials;
  material_id: Scalars['Int']['output'];
};

/** aggregated selection of "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Aggregate = {
  __typename?: 'metal_pdo_detail_materials_aggregate';
  aggregate?: Maybe<Metal_Pdo_Detail_Materials_Aggregate_Fields>;
  nodes: Array<Metal_Pdo_Detail_Materials>;
};

export type Metal_Pdo_Detail_Materials_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Pdo_Detail_Materials_Aggregate_Bool_Exp_Count>;
};

export type Metal_Pdo_Detail_Materials_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Aggregate_Fields = {
  __typename?: 'metal_pdo_detail_materials_aggregate_fields';
  avg?: Maybe<Metal_Pdo_Detail_Materials_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Pdo_Detail_Materials_Max_Fields>;
  min?: Maybe<Metal_Pdo_Detail_Materials_Min_Fields>;
  stddev?: Maybe<Metal_Pdo_Detail_Materials_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Pdo_Detail_Materials_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Pdo_Detail_Materials_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Pdo_Detail_Materials_Sum_Fields>;
  var_pop?: Maybe<Metal_Pdo_Detail_Materials_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Pdo_Detail_Materials_Var_Samp_Fields>;
  variance?: Maybe<Metal_Pdo_Detail_Materials_Variance_Fields>;
};


/** aggregate fields of "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Pdo_Detail_Materials_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Pdo_Detail_Materials_Max_Order_By>;
  min?: InputMaybe<Metal_Pdo_Detail_Materials_Min_Order_By>;
  stddev?: InputMaybe<Metal_Pdo_Detail_Materials_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Pdo_Detail_Materials_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Pdo_Detail_Materials_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Pdo_Detail_Materials_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Pdo_Detail_Materials_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Pdo_Detail_Materials_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Pdo_Detail_Materials_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Arr_Rel_Insert_Input = {
  data: Array<Metal_Pdo_Detail_Materials_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Pdo_Detail_Materials_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Pdo_Detail_Materials_Avg_Fields = {
  __typename?: 'metal_pdo_detail_materials_avg_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Avg_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_pdo.detail_materials". All fields are combined with a logical 'AND'. */
export type Metal_Pdo_Detail_Materials_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Bool_Exp>>;
  _not?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Bool_Exp>>;
  cost?: InputMaybe<Numeric_Comparison_Exp>;
  detail?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
  detail_id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_pdo.detail_materials" */
export enum Metal_Pdo_Detail_Materials_Constraint {
  /** unique or primary key constraint on columns "material_id", "detail_id" */
  DetailMaterialsPKey = 'detail_materials_p_key'
}

/** input type for incrementing numeric columns in table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Inc_Input = {
  cost?: InputMaybe<Scalars['numeric']['input']>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Insert_Input = {
  cost?: InputMaybe<Scalars['numeric']['input']>;
  detail?: InputMaybe<Metal_Pdo_Details_Obj_Rel_Insert_Input>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Pdo_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Metal_Pdo_Detail_Materials_Max_Fields = {
  __typename?: 'metal_pdo_detail_materials_max_fields';
  cost?: Maybe<Scalars['numeric']['output']>;
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Max_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Pdo_Detail_Materials_Min_Fields = {
  __typename?: 'metal_pdo_detail_materials_min_fields';
  cost?: Maybe<Scalars['numeric']['output']>;
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Min_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Mutation_Response = {
  __typename?: 'metal_pdo_detail_materials_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Pdo_Detail_Materials>;
};

/** on_conflict condition type for table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_On_Conflict = {
  constraint: Metal_Pdo_Detail_Materials_Constraint;
  update_columns?: Array<Metal_Pdo_Detail_Materials_Update_Column>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_pdo.detail_materials". */
export type Metal_Pdo_Detail_Materials_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail?: InputMaybe<Metal_Pdo_Details_Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Pdo_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_pdo.detail_materials */
export type Metal_Pdo_Detail_Materials_Pk_Columns_Input = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};

/** select columns of table "metal_pdo.detail_materials" */
export enum Metal_Pdo_Detail_Materials_Select_Column {
  /** column name */
  Cost = 'cost',
  /** column name */
  DetailId = 'detail_id',
  /** column name */
  MaterialId = 'material_id'
}

/** input type for updating data in table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Set_Input = {
  cost?: InputMaybe<Scalars['numeric']['input']>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Pdo_Detail_Materials_Stddev_Fields = {
  __typename?: 'metal_pdo_detail_materials_stddev_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Stddev_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Pdo_Detail_Materials_Stddev_Pop_Fields = {
  __typename?: 'metal_pdo_detail_materials_stddev_pop_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Stddev_Pop_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Pdo_Detail_Materials_Stddev_Samp_Fields = {
  __typename?: 'metal_pdo_detail_materials_stddev_samp_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Stddev_Samp_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_pdo_detail_materials" */
export type Metal_Pdo_Detail_Materials_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Pdo_Detail_Materials_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Pdo_Detail_Materials_Stream_Cursor_Value_Input = {
  cost?: InputMaybe<Scalars['numeric']['input']>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Metal_Pdo_Detail_Materials_Sum_Fields = {
  __typename?: 'metal_pdo_detail_materials_sum_fields';
  cost?: Maybe<Scalars['numeric']['output']>;
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Sum_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** update columns of table "metal_pdo.detail_materials" */
export enum Metal_Pdo_Detail_Materials_Update_Column {
  /** column name */
  Cost = 'cost',
  /** column name */
  DetailId = 'detail_id',
  /** column name */
  MaterialId = 'material_id'
}

export type Metal_Pdo_Detail_Materials_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Pdo_Detail_Materials_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Pdo_Detail_Materials_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Pdo_Detail_Materials_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Pdo_Detail_Materials_Var_Pop_Fields = {
  __typename?: 'metal_pdo_detail_materials_var_pop_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Var_Pop_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Pdo_Detail_Materials_Var_Samp_Fields = {
  __typename?: 'metal_pdo_detail_materials_var_samp_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Var_Samp_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Pdo_Detail_Materials_Variance_Fields = {
  __typename?: 'metal_pdo_detail_materials_variance_fields';
  cost?: Maybe<Scalars['Float']['output']>;
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_pdo.detail_materials" */
export type Metal_Pdo_Detail_Materials_Variance_Order_By = {
  cost?: InputMaybe<Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "metal_pdo.details" */
export type Metal_Pdo_Details = {
  __typename?: 'metal_pdo_details';
  /** An array relationship */
  detail_materials: Array<Metal_Pdo_Detail_Materials>;
  /** An aggregate relationship */
  detail_materials_aggregate: Metal_Pdo_Detail_Materials_Aggregate;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};


/** columns and relationships of "metal_pdo.details" */
export type Metal_Pdo_DetailsDetail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.details" */
export type Metal_Pdo_DetailsDetail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};

/** aggregated selection of "metal_pdo.details" */
export type Metal_Pdo_Details_Aggregate = {
  __typename?: 'metal_pdo_details_aggregate';
  aggregate?: Maybe<Metal_Pdo_Details_Aggregate_Fields>;
  nodes: Array<Metal_Pdo_Details>;
};

/** aggregate fields of "metal_pdo.details" */
export type Metal_Pdo_Details_Aggregate_Fields = {
  __typename?: 'metal_pdo_details_aggregate_fields';
  avg?: Maybe<Metal_Pdo_Details_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Pdo_Details_Max_Fields>;
  min?: Maybe<Metal_Pdo_Details_Min_Fields>;
  stddev?: Maybe<Metal_Pdo_Details_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Pdo_Details_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Pdo_Details_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Pdo_Details_Sum_Fields>;
  var_pop?: Maybe<Metal_Pdo_Details_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Pdo_Details_Var_Samp_Fields>;
  variance?: Maybe<Metal_Pdo_Details_Variance_Fields>;
};


/** aggregate fields of "metal_pdo.details" */
export type Metal_Pdo_Details_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Pdo_Details_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Metal_Pdo_Details_Avg_Fields = {
  __typename?: 'metal_pdo_details_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "metal_pdo.details". All fields are combined with a logical 'AND'. */
export type Metal_Pdo_Details_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Pdo_Details_Bool_Exp>>;
  _not?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Pdo_Details_Bool_Exp>>;
  detail_materials?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
  detail_materials_aggregate?: InputMaybe<Metal_Pdo_Detail_Materials_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_pdo.details" */
export enum Metal_Pdo_Details_Constraint {
  /** unique or primary key constraint on columns "name" */
  DetailNameUniqueIdx = 'detail_name_unique_idx',
  /** unique or primary key constraint on columns "id" */
  DetailsPkey = 'details_pkey'
}

/** input type for incrementing numeric columns in table "metal_pdo.details" */
export type Metal_Pdo_Details_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_pdo.details" */
export type Metal_Pdo_Details_Insert_Input = {
  detail_materials?: InputMaybe<Metal_Pdo_Detail_Materials_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Metal_Pdo_Details_Max_Fields = {
  __typename?: 'metal_pdo_details_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Metal_Pdo_Details_Min_Fields = {
  __typename?: 'metal_pdo_details_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "metal_pdo.details" */
export type Metal_Pdo_Details_Mutation_Response = {
  __typename?: 'metal_pdo_details_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Pdo_Details>;
};

/** input type for inserting object relation for remote table "metal_pdo.details" */
export type Metal_Pdo_Details_Obj_Rel_Insert_Input = {
  data: Metal_Pdo_Details_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Pdo_Details_On_Conflict>;
};

/** on_conflict condition type for table "metal_pdo.details" */
export type Metal_Pdo_Details_On_Conflict = {
  constraint: Metal_Pdo_Details_Constraint;
  update_columns?: Array<Metal_Pdo_Details_Update_Column>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_pdo.details". */
export type Metal_Pdo_Details_Order_By = {
  detail_materials_aggregate?: InputMaybe<Metal_Pdo_Detail_Materials_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_pdo.details */
export type Metal_Pdo_Details_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "metal_pdo.details" */
export enum Metal_Pdo_Details_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "metal_pdo.details" */
export type Metal_Pdo_Details_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Pdo_Details_Stddev_Fields = {
  __typename?: 'metal_pdo_details_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Metal_Pdo_Details_Stddev_Pop_Fields = {
  __typename?: 'metal_pdo_details_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Metal_Pdo_Details_Stddev_Samp_Fields = {
  __typename?: 'metal_pdo_details_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "metal_pdo_details" */
export type Metal_Pdo_Details_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Pdo_Details_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Pdo_Details_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Metal_Pdo_Details_Sum_Fields = {
  __typename?: 'metal_pdo_details_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "metal_pdo.details" */
export enum Metal_Pdo_Details_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Metal_Pdo_Details_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Pdo_Details_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Pdo_Details_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Pdo_Details_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Pdo_Details_Var_Pop_Fields = {
  __typename?: 'metal_pdo_details_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Metal_Pdo_Details_Var_Samp_Fields = {
  __typename?: 'metal_pdo_details_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Metal_Pdo_Details_Variance_Fields = {
  __typename?: 'metal_pdo_details_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_Materials = {
  __typename?: 'metal_pdo_materials';
  /** An array relationship */
  detail_materials: Array<Metal_Pdo_Detail_Materials>;
  /** An aggregate relationship */
  detail_materials_aggregate: Metal_Pdo_Detail_Materials_Aggregate;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  shape: Scalars['Int']['output'];
  shape_data?: Maybe<Scalars['jsonb']['output']>;
  /** An array relationship */
  supplies: Array<Metal_Pdo_Supplies>;
  /** An aggregate relationship */
  supplies_aggregate: Metal_Pdo_Supplies_Aggregate;
  unit: Scalars['Int']['output'];
  /** An array relationship */
  writeoffs: Array<Metal_Pdo_Writeoffs>;
  /** An aggregate relationship */
  writeoffs_aggregate: Metal_Pdo_Writeoffs_Aggregate;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsDetail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsDetail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsShape_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsSuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsSupplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsWriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};


/** columns and relationships of "metal_pdo.materials" */
export type Metal_Pdo_MaterialsWriteoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};

/** aggregated selection of "metal_pdo.materials" */
export type Metal_Pdo_Materials_Aggregate = {
  __typename?: 'metal_pdo_materials_aggregate';
  aggregate?: Maybe<Metal_Pdo_Materials_Aggregate_Fields>;
  nodes: Array<Metal_Pdo_Materials>;
};

/** aggregate fields of "metal_pdo.materials" */
export type Metal_Pdo_Materials_Aggregate_Fields = {
  __typename?: 'metal_pdo_materials_aggregate_fields';
  avg?: Maybe<Metal_Pdo_Materials_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Pdo_Materials_Max_Fields>;
  min?: Maybe<Metal_Pdo_Materials_Min_Fields>;
  stddev?: Maybe<Metal_Pdo_Materials_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Pdo_Materials_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Pdo_Materials_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Pdo_Materials_Sum_Fields>;
  var_pop?: Maybe<Metal_Pdo_Materials_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Pdo_Materials_Var_Samp_Fields>;
  variance?: Maybe<Metal_Pdo_Materials_Variance_Fields>;
};


/** aggregate fields of "metal_pdo.materials" */
export type Metal_Pdo_Materials_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Pdo_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Metal_Pdo_Materials_Append_Input = {
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Metal_Pdo_Materials_Avg_Fields = {
  __typename?: 'metal_pdo_materials_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "metal_pdo.materials". All fields are combined with a logical 'AND'. */
export type Metal_Pdo_Materials_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Pdo_Materials_Bool_Exp>>;
  _not?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Pdo_Materials_Bool_Exp>>;
  detail_materials?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
  detail_materials_aggregate?: InputMaybe<Metal_Pdo_Detail_Materials_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  shape?: InputMaybe<Int_Comparison_Exp>;
  shape_data?: InputMaybe<Jsonb_Comparison_Exp>;
  supplies?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
  supplies_aggregate?: InputMaybe<Metal_Pdo_Supplies_Aggregate_Bool_Exp>;
  unit?: InputMaybe<Int_Comparison_Exp>;
  writeoffs?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
  writeoffs_aggregate?: InputMaybe<Metal_Pdo_Writeoffs_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "metal_pdo.materials" */
export enum Metal_Pdo_Materials_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialsPkey = 'materials_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Metal_Pdo_Materials_Delete_At_Path_Input = {
  shape_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Metal_Pdo_Materials_Delete_Elem_Input = {
  shape_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Metal_Pdo_Materials_Delete_Key_Input = {
  shape_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "metal_pdo.materials" */
export type Metal_Pdo_Materials_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_pdo.materials" */
export type Metal_Pdo_Materials_Insert_Input = {
  detail_materials?: InputMaybe<Metal_Pdo_Detail_Materials_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  supplies?: InputMaybe<Metal_Pdo_Supplies_Arr_Rel_Insert_Input>;
  unit?: InputMaybe<Scalars['Int']['input']>;
  writeoffs?: InputMaybe<Metal_Pdo_Writeoffs_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Metal_Pdo_Materials_Max_Fields = {
  __typename?: 'metal_pdo_materials_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Metal_Pdo_Materials_Min_Fields = {
  __typename?: 'metal_pdo_materials_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "metal_pdo.materials" */
export type Metal_Pdo_Materials_Mutation_Response = {
  __typename?: 'metal_pdo_materials_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Pdo_Materials>;
};

/** input type for inserting object relation for remote table "metal_pdo.materials" */
export type Metal_Pdo_Materials_Obj_Rel_Insert_Input = {
  data: Metal_Pdo_Materials_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Pdo_Materials_On_Conflict>;
};

/** on_conflict condition type for table "metal_pdo.materials" */
export type Metal_Pdo_Materials_On_Conflict = {
  constraint: Metal_Pdo_Materials_Constraint;
  update_columns?: Array<Metal_Pdo_Materials_Update_Column>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_pdo.materials". */
export type Metal_Pdo_Materials_Order_By = {
  detail_materials_aggregate?: InputMaybe<Metal_Pdo_Detail_Materials_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  shape?: InputMaybe<Order_By>;
  shape_data?: InputMaybe<Order_By>;
  supplies_aggregate?: InputMaybe<Metal_Pdo_Supplies_Aggregate_Order_By>;
  unit?: InputMaybe<Order_By>;
  writeoffs_aggregate?: InputMaybe<Metal_Pdo_Writeoffs_Aggregate_Order_By>;
};

/** primary key columns input for table: metal_pdo.materials */
export type Metal_Pdo_Materials_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Metal_Pdo_Materials_Prepend_Input = {
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "metal_pdo.materials" */
export enum Metal_Pdo_Materials_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Shape = 'shape',
  /** column name */
  ShapeData = 'shape_data',
  /** column name */
  Unit = 'unit'
}

/** input type for updating data in table "metal_pdo.materials" */
export type Metal_Pdo_Materials_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Pdo_Materials_Stddev_Fields = {
  __typename?: 'metal_pdo_materials_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Metal_Pdo_Materials_Stddev_Pop_Fields = {
  __typename?: 'metal_pdo_materials_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Metal_Pdo_Materials_Stddev_Samp_Fields = {
  __typename?: 'metal_pdo_materials_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "metal_pdo_materials" */
export type Metal_Pdo_Materials_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Pdo_Materials_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Pdo_Materials_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Metal_Pdo_Materials_Sum_Fields = {
  __typename?: 'metal_pdo_materials_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "metal_pdo.materials" */
export enum Metal_Pdo_Materials_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Shape = 'shape',
  /** column name */
  ShapeData = 'shape_data',
  /** column name */
  Unit = 'unit'
}

export type Metal_Pdo_Materials_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Metal_Pdo_Materials_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Metal_Pdo_Materials_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Metal_Pdo_Materials_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Metal_Pdo_Materials_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Pdo_Materials_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Metal_Pdo_Materials_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Pdo_Materials_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Pdo_Materials_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Pdo_Materials_Var_Pop_Fields = {
  __typename?: 'metal_pdo_materials_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Metal_Pdo_Materials_Var_Samp_Fields = {
  __typename?: 'metal_pdo_materials_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Metal_Pdo_Materials_Variance_Fields = {
  __typename?: 'metal_pdo_materials_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "metal_pdo.supplies" */
export type Metal_Pdo_Supplies = {
  __typename?: 'metal_pdo_supplies';
  id: Scalars['Int']['output'];
  /** An object relationship */
  material?: Maybe<Metal_Pdo_Materials>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty: Scalars['numeric']['output'];
  supplied_at: Scalars['timestamp']['output'];
  supplier_name: Scalars['String']['output'];
};

/** aggregated selection of "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Aggregate = {
  __typename?: 'metal_pdo_supplies_aggregate';
  aggregate?: Maybe<Metal_Pdo_Supplies_Aggregate_Fields>;
  nodes: Array<Metal_Pdo_Supplies>;
};

export type Metal_Pdo_Supplies_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Pdo_Supplies_Aggregate_Bool_Exp_Count>;
};

export type Metal_Pdo_Supplies_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Aggregate_Fields = {
  __typename?: 'metal_pdo_supplies_aggregate_fields';
  avg?: Maybe<Metal_Pdo_Supplies_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Pdo_Supplies_Max_Fields>;
  min?: Maybe<Metal_Pdo_Supplies_Min_Fields>;
  stddev?: Maybe<Metal_Pdo_Supplies_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Pdo_Supplies_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Pdo_Supplies_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Pdo_Supplies_Sum_Fields>;
  var_pop?: Maybe<Metal_Pdo_Supplies_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Pdo_Supplies_Var_Samp_Fields>;
  variance?: Maybe<Metal_Pdo_Supplies_Variance_Fields>;
};


/** aggregate fields of "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Pdo_Supplies_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Pdo_Supplies_Max_Order_By>;
  min?: InputMaybe<Metal_Pdo_Supplies_Min_Order_By>;
  stddev?: InputMaybe<Metal_Pdo_Supplies_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Pdo_Supplies_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Pdo_Supplies_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Pdo_Supplies_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Pdo_Supplies_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Pdo_Supplies_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Pdo_Supplies_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Arr_Rel_Insert_Input = {
  data: Array<Metal_Pdo_Supplies_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Pdo_Supplies_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Pdo_Supplies_Avg_Fields = {
  __typename?: 'metal_pdo_supplies_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_pdo.supplies". All fields are combined with a logical 'AND'. */
export type Metal_Pdo_Supplies_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Pdo_Supplies_Bool_Exp>>;
  _not?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Pdo_Supplies_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
  qty?: InputMaybe<Numeric_Comparison_Exp>;
  supplied_at?: InputMaybe<Timestamp_Comparison_Exp>;
  supplier_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_pdo.supplies" */
export enum Metal_Pdo_Supplies_Constraint {
  /** unique or primary key constraint on columns "id" */
  SuppliesPkey = 'supplies_pkey'
}

/** input type for incrementing numeric columns in table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Pdo_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Metal_Pdo_Supplies_Max_Fields = {
  __typename?: 'metal_pdo_supplies_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  supplied_at?: Maybe<Scalars['timestamp']['output']>;
  supplier_name?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Pdo_Supplies_Min_Fields = {
  __typename?: 'metal_pdo_supplies_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  supplied_at?: Maybe<Scalars['timestamp']['output']>;
  supplier_name?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Mutation_Response = {
  __typename?: 'metal_pdo_supplies_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Pdo_Supplies>;
};

/** on_conflict condition type for table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_On_Conflict = {
  constraint: Metal_Pdo_Supplies_Constraint;
  update_columns?: Array<Metal_Pdo_Supplies_Update_Column>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_pdo.supplies". */
export type Metal_Pdo_Supplies_Order_By = {
  id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Pdo_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_pdo.supplies */
export type Metal_Pdo_Supplies_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "metal_pdo.supplies" */
export enum Metal_Pdo_Supplies_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaterialId = 'material_id',
  /** column name */
  Qty = 'qty',
  /** column name */
  SuppliedAt = 'supplied_at',
  /** column name */
  SupplierName = 'supplier_name'
}

/** input type for updating data in table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Pdo_Supplies_Stddev_Fields = {
  __typename?: 'metal_pdo_supplies_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Pdo_Supplies_Stddev_Pop_Fields = {
  __typename?: 'metal_pdo_supplies_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Pdo_Supplies_Stddev_Samp_Fields = {
  __typename?: 'metal_pdo_supplies_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_pdo_supplies" */
export type Metal_Pdo_Supplies_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Pdo_Supplies_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Pdo_Supplies_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Metal_Pdo_Supplies_Sum_Fields = {
  __typename?: 'metal_pdo_supplies_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** update columns of table "metal_pdo.supplies" */
export enum Metal_Pdo_Supplies_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaterialId = 'material_id',
  /** column name */
  Qty = 'qty',
  /** column name */
  SuppliedAt = 'supplied_at',
  /** column name */
  SupplierName = 'supplier_name'
}

export type Metal_Pdo_Supplies_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Pdo_Supplies_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Pdo_Supplies_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Pdo_Supplies_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Pdo_Supplies_Var_Pop_Fields = {
  __typename?: 'metal_pdo_supplies_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Pdo_Supplies_Var_Samp_Fields = {
  __typename?: 'metal_pdo_supplies_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Pdo_Supplies_Variance_Fields = {
  __typename?: 'metal_pdo_supplies_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_pdo.supplies" */
export type Metal_Pdo_Supplies_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** columns and relationships of "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs = {
  __typename?: 'metal_pdo_writeoffs';
  date: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  material: Metal_Pdo_Materials;
  material_id: Scalars['Int']['output'];
  qty: Scalars['numeric']['output'];
  reason: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  type_data: Scalars['jsonb']['output'];
};


/** columns and relationships of "metal_pdo.writeoffs" */
export type Metal_Pdo_WriteoffsType_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Aggregate = {
  __typename?: 'metal_pdo_writeoffs_aggregate';
  aggregate?: Maybe<Metal_Pdo_Writeoffs_Aggregate_Fields>;
  nodes: Array<Metal_Pdo_Writeoffs>;
};

export type Metal_Pdo_Writeoffs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Pdo_Writeoffs_Aggregate_Bool_Exp_Count>;
};

export type Metal_Pdo_Writeoffs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Aggregate_Fields = {
  __typename?: 'metal_pdo_writeoffs_aggregate_fields';
  avg?: Maybe<Metal_Pdo_Writeoffs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Pdo_Writeoffs_Max_Fields>;
  min?: Maybe<Metal_Pdo_Writeoffs_Min_Fields>;
  stddev?: Maybe<Metal_Pdo_Writeoffs_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Pdo_Writeoffs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Pdo_Writeoffs_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Pdo_Writeoffs_Sum_Fields>;
  var_pop?: Maybe<Metal_Pdo_Writeoffs_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Pdo_Writeoffs_Var_Samp_Fields>;
  variance?: Maybe<Metal_Pdo_Writeoffs_Variance_Fields>;
};


/** aggregate fields of "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Pdo_Writeoffs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Pdo_Writeoffs_Max_Order_By>;
  min?: InputMaybe<Metal_Pdo_Writeoffs_Min_Order_By>;
  stddev?: InputMaybe<Metal_Pdo_Writeoffs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Pdo_Writeoffs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Pdo_Writeoffs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Pdo_Writeoffs_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Pdo_Writeoffs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Pdo_Writeoffs_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Pdo_Writeoffs_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Metal_Pdo_Writeoffs_Append_Input = {
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Arr_Rel_Insert_Input = {
  data: Array<Metal_Pdo_Writeoffs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Pdo_Writeoffs_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Pdo_Writeoffs_Avg_Fields = {
  __typename?: 'metal_pdo_writeoffs_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_pdo.writeoffs". All fields are combined with a logical 'AND'. */
export type Metal_Pdo_Writeoffs_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Pdo_Writeoffs_Bool_Exp>>;
  _not?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Pdo_Writeoffs_Bool_Exp>>;
  date?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
  qty?: InputMaybe<Numeric_Comparison_Exp>;
  reason?: InputMaybe<Int_Comparison_Exp>;
  type?: InputMaybe<Int_Comparison_Exp>;
  type_data?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_pdo.writeoffs" */
export enum Metal_Pdo_Writeoffs_Constraint {
  /** unique or primary key constraint on columns "id" */
  WriteoffsPkey = 'writeoffs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Metal_Pdo_Writeoffs_Delete_At_Path_Input = {
  type_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Metal_Pdo_Writeoffs_Delete_Elem_Input = {
  type_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Metal_Pdo_Writeoffs_Delete_Key_Input = {
  type_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Insert_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Pdo_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Metal_Pdo_Writeoffs_Max_Fields = {
  __typename?: 'metal_pdo_writeoffs_max_fields';
  date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Max_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Pdo_Writeoffs_Min_Fields = {
  __typename?: 'metal_pdo_writeoffs_min_fields';
  date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Min_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Mutation_Response = {
  __typename?: 'metal_pdo_writeoffs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Pdo_Writeoffs>;
};

/** on_conflict condition type for table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_On_Conflict = {
  constraint: Metal_Pdo_Writeoffs_Constraint;
  update_columns?: Array<Metal_Pdo_Writeoffs_Update_Column>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_pdo.writeoffs". */
export type Metal_Pdo_Writeoffs_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Pdo_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  type_data?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_pdo.writeoffs */
export type Metal_Pdo_Writeoffs_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Metal_Pdo_Writeoffs_Prepend_Input = {
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "metal_pdo.writeoffs" */
export enum Metal_Pdo_Writeoffs_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialId = 'material_id',
  /** column name */
  Qty = 'qty',
  /** column name */
  Reason = 'reason',
  /** column name */
  Type = 'type',
  /** column name */
  TypeData = 'type_data'
}

/** input type for updating data in table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Set_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Pdo_Writeoffs_Stddev_Fields = {
  __typename?: 'metal_pdo_writeoffs_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Pdo_Writeoffs_Stddev_Pop_Fields = {
  __typename?: 'metal_pdo_writeoffs_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Pdo_Writeoffs_Stddev_Samp_Fields = {
  __typename?: 'metal_pdo_writeoffs_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_pdo_writeoffs" */
export type Metal_Pdo_Writeoffs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Pdo_Writeoffs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Pdo_Writeoffs_Stream_Cursor_Value_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Metal_Pdo_Writeoffs_Sum_Fields = {
  __typename?: 'metal_pdo_writeoffs_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** update columns of table "metal_pdo.writeoffs" */
export enum Metal_Pdo_Writeoffs_Update_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialId = 'material_id',
  /** column name */
  Qty = 'qty',
  /** column name */
  Reason = 'reason',
  /** column name */
  Type = 'type',
  /** column name */
  TypeData = 'type_data'
}

export type Metal_Pdo_Writeoffs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Metal_Pdo_Writeoffs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Metal_Pdo_Writeoffs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Pdo_Writeoffs_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Metal_Pdo_Writeoffs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Pdo_Writeoffs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Pdo_Writeoffs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Pdo_Writeoffs_Var_Pop_Fields = {
  __typename?: 'metal_pdo_writeoffs_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Pdo_Writeoffs_Var_Samp_Fields = {
  __typename?: 'metal_pdo_writeoffs_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Pdo_Writeoffs_Variance_Fields = {
  __typename?: 'metal_pdo_writeoffs_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_pdo.writeoffs" */
export type Metal_Pdo_Writeoffs_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "attendance.config" */
  delete_attendance_config?: Maybe<Attendance_Config_Mutation_Response>;
  /** delete single row from the table: "attendance.config" */
  delete_attendance_config_by_pk?: Maybe<Attendance_Config>;
  /** delete data from the table: "attendance.intervals" */
  delete_attendance_intervals?: Maybe<Attendance_Intervals_Mutation_Response>;
  /** delete single row from the table: "attendance.intervals" */
  delete_attendance_intervals_by_pk?: Maybe<Attendance_Intervals>;
  /** delete data from the table: "attendance.users" */
  delete_attendance_users?: Maybe<Attendance_Users_Mutation_Response>;
  /** delete single row from the table: "attendance.users" */
  delete_attendance_users_by_pk?: Maybe<Attendance_Users>;
  /** delete data from the table: "erp.AccessLevels" */
  delete_erp_AccessLevels?: Maybe<Erp_AccessLevels_Mutation_Response>;
  /** delete single row from the table: "erp.AccessLevels" */
  delete_erp_AccessLevels_by_pk?: Maybe<Erp_AccessLevels>;
  /** delete data from the table: "erp.Comments" */
  delete_erp_Comments?: Maybe<Erp_Comments_Mutation_Response>;
  /** delete single row from the table: "erp.Comments" */
  delete_erp_Comments_by_pk?: Maybe<Erp_Comments>;
  /** delete data from the table: "erp.Docs" */
  delete_erp_Docs?: Maybe<Erp_Docs_Mutation_Response>;
  /** delete single row from the table: "erp.Docs" */
  delete_erp_Docs_by_pk?: Maybe<Erp_Docs>;
  /** delete data from the table: "erp.Notifications" */
  delete_erp_Notifications?: Maybe<Erp_Notifications_Mutation_Response>;
  /** delete single row from the table: "erp.Notifications" */
  delete_erp_Notifications_by_pk?: Maybe<Erp_Notifications>;
  /** delete data from the table: "erp.OrderItems" */
  delete_erp_OrderItems?: Maybe<Erp_OrderItems_Mutation_Response>;
  /** delete single row from the table: "erp.OrderItems" */
  delete_erp_OrderItems_by_pk?: Maybe<Erp_OrderItems>;
  /** delete data from the table: "erp.OrderStatus" */
  delete_erp_OrderStatus?: Maybe<Erp_OrderStatus_Mutation_Response>;
  /** delete single row from the table: "erp.OrderStatus" */
  delete_erp_OrderStatus_by_pk?: Maybe<Erp_OrderStatus>;
  /** delete data from the table: "erp.Orders" */
  delete_erp_Orders?: Maybe<Erp_Orders_Mutation_Response>;
  /** delete single row from the table: "erp.Orders" */
  delete_erp_Orders_by_pk?: Maybe<Erp_Orders>;
  /** delete data from the table: "erp.PaymentHistory" */
  delete_erp_PaymentHistory?: Maybe<Erp_PaymentHistory_Mutation_Response>;
  /** delete single row from the table: "erp.PaymentHistory" */
  delete_erp_PaymentHistory_by_pk?: Maybe<Erp_PaymentHistory>;
  /** delete data from the table: "erp.Tokens" */
  delete_erp_Tokens?: Maybe<Erp_Tokens_Mutation_Response>;
  /** delete single row from the table: "erp.Tokens" */
  delete_erp_Tokens_by_pk?: Maybe<Erp_Tokens>;
  /** delete data from the table: "erp.Users" */
  delete_erp_Users?: Maybe<Erp_Users_Mutation_Response>;
  /** delete single row from the table: "erp.Users" */
  delete_erp_Users_by_pk?: Maybe<Erp_Users>;
  /** delete data from the table: "kysely_migration" */
  delete_kysely_migration?: Maybe<Kysely_Migration_Mutation_Response>;
  /** delete single row from the table: "kysely_migration" */
  delete_kysely_migration_by_pk?: Maybe<Kysely_Migration>;
  /** delete data from the table: "kysely_migration_lock" */
  delete_kysely_migration_lock?: Maybe<Kysely_Migration_Lock_Mutation_Response>;
  /** delete single row from the table: "kysely_migration_lock" */
  delete_kysely_migration_lock_by_pk?: Maybe<Kysely_Migration_Lock>;
  /** delete data from the table: "metal_pdo.detail_materials" */
  delete_metal_pdo_detail_materials?: Maybe<Metal_Pdo_Detail_Materials_Mutation_Response>;
  /** delete single row from the table: "metal_pdo.detail_materials" */
  delete_metal_pdo_detail_materials_by_pk?: Maybe<Metal_Pdo_Detail_Materials>;
  /** delete data from the table: "metal_pdo.details" */
  delete_metal_pdo_details?: Maybe<Metal_Pdo_Details_Mutation_Response>;
  /** delete single row from the table: "metal_pdo.details" */
  delete_metal_pdo_details_by_pk?: Maybe<Metal_Pdo_Details>;
  /** delete data from the table: "metal_pdo.materials" */
  delete_metal_pdo_materials?: Maybe<Metal_Pdo_Materials_Mutation_Response>;
  /** delete single row from the table: "metal_pdo.materials" */
  delete_metal_pdo_materials_by_pk?: Maybe<Metal_Pdo_Materials>;
  /** delete data from the table: "metal_pdo.supplies" */
  delete_metal_pdo_supplies?: Maybe<Metal_Pdo_Supplies_Mutation_Response>;
  /** delete single row from the table: "metal_pdo.supplies" */
  delete_metal_pdo_supplies_by_pk?: Maybe<Metal_Pdo_Supplies>;
  /** delete data from the table: "metal_pdo.writeoffs" */
  delete_metal_pdo_writeoffs?: Maybe<Metal_Pdo_Writeoffs_Mutation_Response>;
  /** delete single row from the table: "metal_pdo.writeoffs" */
  delete_metal_pdo_writeoffs_by_pk?: Maybe<Metal_Pdo_Writeoffs>;
  /** insert data into the table: "attendance.config" */
  insert_attendance_config?: Maybe<Attendance_Config_Mutation_Response>;
  /** insert a single row into the table: "attendance.config" */
  insert_attendance_config_one?: Maybe<Attendance_Config>;
  /** insert data into the table: "attendance.intervals" */
  insert_attendance_intervals?: Maybe<Attendance_Intervals_Mutation_Response>;
  /** insert a single row into the table: "attendance.intervals" */
  insert_attendance_intervals_one?: Maybe<Attendance_Intervals>;
  /** insert data into the table: "attendance.users" */
  insert_attendance_users?: Maybe<Attendance_Users_Mutation_Response>;
  /** insert a single row into the table: "attendance.users" */
  insert_attendance_users_one?: Maybe<Attendance_Users>;
  /** insert data into the table: "erp.AccessLevels" */
  insert_erp_AccessLevels?: Maybe<Erp_AccessLevels_Mutation_Response>;
  /** insert a single row into the table: "erp.AccessLevels" */
  insert_erp_AccessLevels_one?: Maybe<Erp_AccessLevels>;
  /** insert data into the table: "erp.Comments" */
  insert_erp_Comments?: Maybe<Erp_Comments_Mutation_Response>;
  /** insert a single row into the table: "erp.Comments" */
  insert_erp_Comments_one?: Maybe<Erp_Comments>;
  /** insert data into the table: "erp.Docs" */
  insert_erp_Docs?: Maybe<Erp_Docs_Mutation_Response>;
  /** insert a single row into the table: "erp.Docs" */
  insert_erp_Docs_one?: Maybe<Erp_Docs>;
  /** insert data into the table: "erp.Notifications" */
  insert_erp_Notifications?: Maybe<Erp_Notifications_Mutation_Response>;
  /** insert a single row into the table: "erp.Notifications" */
  insert_erp_Notifications_one?: Maybe<Erp_Notifications>;
  /** insert data into the table: "erp.OrderItems" */
  insert_erp_OrderItems?: Maybe<Erp_OrderItems_Mutation_Response>;
  /** insert a single row into the table: "erp.OrderItems" */
  insert_erp_OrderItems_one?: Maybe<Erp_OrderItems>;
  /** insert data into the table: "erp.OrderStatus" */
  insert_erp_OrderStatus?: Maybe<Erp_OrderStatus_Mutation_Response>;
  /** insert a single row into the table: "erp.OrderStatus" */
  insert_erp_OrderStatus_one?: Maybe<Erp_OrderStatus>;
  /** insert data into the table: "erp.Orders" */
  insert_erp_Orders?: Maybe<Erp_Orders_Mutation_Response>;
  /** insert a single row into the table: "erp.Orders" */
  insert_erp_Orders_one?: Maybe<Erp_Orders>;
  /** insert data into the table: "erp.PaymentHistory" */
  insert_erp_PaymentHistory?: Maybe<Erp_PaymentHistory_Mutation_Response>;
  /** insert a single row into the table: "erp.PaymentHistory" */
  insert_erp_PaymentHistory_one?: Maybe<Erp_PaymentHistory>;
  /** insert data into the table: "erp.Tokens" */
  insert_erp_Tokens?: Maybe<Erp_Tokens_Mutation_Response>;
  /** insert a single row into the table: "erp.Tokens" */
  insert_erp_Tokens_one?: Maybe<Erp_Tokens>;
  /** insert data into the table: "erp.Users" */
  insert_erp_Users?: Maybe<Erp_Users_Mutation_Response>;
  /** insert a single row into the table: "erp.Users" */
  insert_erp_Users_one?: Maybe<Erp_Users>;
  /** insert data into the table: "kysely_migration" */
  insert_kysely_migration?: Maybe<Kysely_Migration_Mutation_Response>;
  /** insert data into the table: "kysely_migration_lock" */
  insert_kysely_migration_lock?: Maybe<Kysely_Migration_Lock_Mutation_Response>;
  /** insert a single row into the table: "kysely_migration_lock" */
  insert_kysely_migration_lock_one?: Maybe<Kysely_Migration_Lock>;
  /** insert a single row into the table: "kysely_migration" */
  insert_kysely_migration_one?: Maybe<Kysely_Migration>;
  /** insert data into the table: "metal_pdo.detail_materials" */
  insert_metal_pdo_detail_materials?: Maybe<Metal_Pdo_Detail_Materials_Mutation_Response>;
  /** insert a single row into the table: "metal_pdo.detail_materials" */
  insert_metal_pdo_detail_materials_one?: Maybe<Metal_Pdo_Detail_Materials>;
  /** insert data into the table: "metal_pdo.details" */
  insert_metal_pdo_details?: Maybe<Metal_Pdo_Details_Mutation_Response>;
  /** insert a single row into the table: "metal_pdo.details" */
  insert_metal_pdo_details_one?: Maybe<Metal_Pdo_Details>;
  /** insert data into the table: "metal_pdo.materials" */
  insert_metal_pdo_materials?: Maybe<Metal_Pdo_Materials_Mutation_Response>;
  /** insert a single row into the table: "metal_pdo.materials" */
  insert_metal_pdo_materials_one?: Maybe<Metal_Pdo_Materials>;
  /** insert data into the table: "metal_pdo.supplies" */
  insert_metal_pdo_supplies?: Maybe<Metal_Pdo_Supplies_Mutation_Response>;
  /** insert a single row into the table: "metal_pdo.supplies" */
  insert_metal_pdo_supplies_one?: Maybe<Metal_Pdo_Supplies>;
  /** insert data into the table: "metal_pdo.writeoffs" */
  insert_metal_pdo_writeoffs?: Maybe<Metal_Pdo_Writeoffs_Mutation_Response>;
  /** insert a single row into the table: "metal_pdo.writeoffs" */
  insert_metal_pdo_writeoffs_one?: Maybe<Metal_Pdo_Writeoffs>;
  /** update data of the table: "attendance.config" */
  update_attendance_config?: Maybe<Attendance_Config_Mutation_Response>;
  /** update single row of the table: "attendance.config" */
  update_attendance_config_by_pk?: Maybe<Attendance_Config>;
  /** update multiples rows of table: "attendance.config" */
  update_attendance_config_many?: Maybe<Array<Maybe<Attendance_Config_Mutation_Response>>>;
  /** update data of the table: "attendance.intervals" */
  update_attendance_intervals?: Maybe<Attendance_Intervals_Mutation_Response>;
  /** update single row of the table: "attendance.intervals" */
  update_attendance_intervals_by_pk?: Maybe<Attendance_Intervals>;
  /** update multiples rows of table: "attendance.intervals" */
  update_attendance_intervals_many?: Maybe<Array<Maybe<Attendance_Intervals_Mutation_Response>>>;
  /** update data of the table: "attendance.users" */
  update_attendance_users?: Maybe<Attendance_Users_Mutation_Response>;
  /** update single row of the table: "attendance.users" */
  update_attendance_users_by_pk?: Maybe<Attendance_Users>;
  /** update multiples rows of table: "attendance.users" */
  update_attendance_users_many?: Maybe<Array<Maybe<Attendance_Users_Mutation_Response>>>;
  /** update data of the table: "erp.AccessLevels" */
  update_erp_AccessLevels?: Maybe<Erp_AccessLevels_Mutation_Response>;
  /** update single row of the table: "erp.AccessLevels" */
  update_erp_AccessLevels_by_pk?: Maybe<Erp_AccessLevels>;
  /** update multiples rows of table: "erp.AccessLevels" */
  update_erp_AccessLevels_many?: Maybe<Array<Maybe<Erp_AccessLevels_Mutation_Response>>>;
  /** update data of the table: "erp.Comments" */
  update_erp_Comments?: Maybe<Erp_Comments_Mutation_Response>;
  /** update single row of the table: "erp.Comments" */
  update_erp_Comments_by_pk?: Maybe<Erp_Comments>;
  /** update multiples rows of table: "erp.Comments" */
  update_erp_Comments_many?: Maybe<Array<Maybe<Erp_Comments_Mutation_Response>>>;
  /** update data of the table: "erp.Docs" */
  update_erp_Docs?: Maybe<Erp_Docs_Mutation_Response>;
  /** update single row of the table: "erp.Docs" */
  update_erp_Docs_by_pk?: Maybe<Erp_Docs>;
  /** update multiples rows of table: "erp.Docs" */
  update_erp_Docs_many?: Maybe<Array<Maybe<Erp_Docs_Mutation_Response>>>;
  /** update data of the table: "erp.Notifications" */
  update_erp_Notifications?: Maybe<Erp_Notifications_Mutation_Response>;
  /** update single row of the table: "erp.Notifications" */
  update_erp_Notifications_by_pk?: Maybe<Erp_Notifications>;
  /** update multiples rows of table: "erp.Notifications" */
  update_erp_Notifications_many?: Maybe<Array<Maybe<Erp_Notifications_Mutation_Response>>>;
  /** update data of the table: "erp.OrderItems" */
  update_erp_OrderItems?: Maybe<Erp_OrderItems_Mutation_Response>;
  /** update single row of the table: "erp.OrderItems" */
  update_erp_OrderItems_by_pk?: Maybe<Erp_OrderItems>;
  /** update multiples rows of table: "erp.OrderItems" */
  update_erp_OrderItems_many?: Maybe<Array<Maybe<Erp_OrderItems_Mutation_Response>>>;
  /** update data of the table: "erp.OrderStatus" */
  update_erp_OrderStatus?: Maybe<Erp_OrderStatus_Mutation_Response>;
  /** update single row of the table: "erp.OrderStatus" */
  update_erp_OrderStatus_by_pk?: Maybe<Erp_OrderStatus>;
  /** update multiples rows of table: "erp.OrderStatus" */
  update_erp_OrderStatus_many?: Maybe<Array<Maybe<Erp_OrderStatus_Mutation_Response>>>;
  /** update data of the table: "erp.Orders" */
  update_erp_Orders?: Maybe<Erp_Orders_Mutation_Response>;
  /** update single row of the table: "erp.Orders" */
  update_erp_Orders_by_pk?: Maybe<Erp_Orders>;
  /** update multiples rows of table: "erp.Orders" */
  update_erp_Orders_many?: Maybe<Array<Maybe<Erp_Orders_Mutation_Response>>>;
  /** update data of the table: "erp.PaymentHistory" */
  update_erp_PaymentHistory?: Maybe<Erp_PaymentHistory_Mutation_Response>;
  /** update single row of the table: "erp.PaymentHistory" */
  update_erp_PaymentHistory_by_pk?: Maybe<Erp_PaymentHistory>;
  /** update multiples rows of table: "erp.PaymentHistory" */
  update_erp_PaymentHistory_many?: Maybe<Array<Maybe<Erp_PaymentHistory_Mutation_Response>>>;
  /** update data of the table: "erp.Tokens" */
  update_erp_Tokens?: Maybe<Erp_Tokens_Mutation_Response>;
  /** update single row of the table: "erp.Tokens" */
  update_erp_Tokens_by_pk?: Maybe<Erp_Tokens>;
  /** update multiples rows of table: "erp.Tokens" */
  update_erp_Tokens_many?: Maybe<Array<Maybe<Erp_Tokens_Mutation_Response>>>;
  /** update data of the table: "erp.Users" */
  update_erp_Users?: Maybe<Erp_Users_Mutation_Response>;
  /** update single row of the table: "erp.Users" */
  update_erp_Users_by_pk?: Maybe<Erp_Users>;
  /** update multiples rows of table: "erp.Users" */
  update_erp_Users_many?: Maybe<Array<Maybe<Erp_Users_Mutation_Response>>>;
  /** update data of the table: "kysely_migration" */
  update_kysely_migration?: Maybe<Kysely_Migration_Mutation_Response>;
  /** update single row of the table: "kysely_migration" */
  update_kysely_migration_by_pk?: Maybe<Kysely_Migration>;
  /** update data of the table: "kysely_migration_lock" */
  update_kysely_migration_lock?: Maybe<Kysely_Migration_Lock_Mutation_Response>;
  /** update single row of the table: "kysely_migration_lock" */
  update_kysely_migration_lock_by_pk?: Maybe<Kysely_Migration_Lock>;
  /** update multiples rows of table: "kysely_migration_lock" */
  update_kysely_migration_lock_many?: Maybe<Array<Maybe<Kysely_Migration_Lock_Mutation_Response>>>;
  /** update multiples rows of table: "kysely_migration" */
  update_kysely_migration_many?: Maybe<Array<Maybe<Kysely_Migration_Mutation_Response>>>;
  /** update data of the table: "metal_pdo.detail_materials" */
  update_metal_pdo_detail_materials?: Maybe<Metal_Pdo_Detail_Materials_Mutation_Response>;
  /** update single row of the table: "metal_pdo.detail_materials" */
  update_metal_pdo_detail_materials_by_pk?: Maybe<Metal_Pdo_Detail_Materials>;
  /** update multiples rows of table: "metal_pdo.detail_materials" */
  update_metal_pdo_detail_materials_many?: Maybe<Array<Maybe<Metal_Pdo_Detail_Materials_Mutation_Response>>>;
  /** update data of the table: "metal_pdo.details" */
  update_metal_pdo_details?: Maybe<Metal_Pdo_Details_Mutation_Response>;
  /** update single row of the table: "metal_pdo.details" */
  update_metal_pdo_details_by_pk?: Maybe<Metal_Pdo_Details>;
  /** update multiples rows of table: "metal_pdo.details" */
  update_metal_pdo_details_many?: Maybe<Array<Maybe<Metal_Pdo_Details_Mutation_Response>>>;
  /** update data of the table: "metal_pdo.materials" */
  update_metal_pdo_materials?: Maybe<Metal_Pdo_Materials_Mutation_Response>;
  /** update single row of the table: "metal_pdo.materials" */
  update_metal_pdo_materials_by_pk?: Maybe<Metal_Pdo_Materials>;
  /** update multiples rows of table: "metal_pdo.materials" */
  update_metal_pdo_materials_many?: Maybe<Array<Maybe<Metal_Pdo_Materials_Mutation_Response>>>;
  /** update data of the table: "metal_pdo.supplies" */
  update_metal_pdo_supplies?: Maybe<Metal_Pdo_Supplies_Mutation_Response>;
  /** update single row of the table: "metal_pdo.supplies" */
  update_metal_pdo_supplies_by_pk?: Maybe<Metal_Pdo_Supplies>;
  /** update multiples rows of table: "metal_pdo.supplies" */
  update_metal_pdo_supplies_many?: Maybe<Array<Maybe<Metal_Pdo_Supplies_Mutation_Response>>>;
  /** update data of the table: "metal_pdo.writeoffs" */
  update_metal_pdo_writeoffs?: Maybe<Metal_Pdo_Writeoffs_Mutation_Response>;
  /** update single row of the table: "metal_pdo.writeoffs" */
  update_metal_pdo_writeoffs_by_pk?: Maybe<Metal_Pdo_Writeoffs>;
  /** update multiples rows of table: "metal_pdo.writeoffs" */
  update_metal_pdo_writeoffs_many?: Maybe<Array<Maybe<Metal_Pdo_Writeoffs_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_Attendance_ConfigArgs = {
  where: Attendance_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attendance_Config_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Attendance_IntervalsArgs = {
  where: Attendance_Intervals_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attendance_Intervals_By_PkArgs = {
  card: Scalars['String']['input'];
  ent_event_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Attendance_UsersArgs = {
  where: Attendance_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attendance_Users_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_AccessLevelsArgs = {
  where: Erp_AccessLevels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_AccessLevels_By_PkArgs = {
  AccessLevelID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_CommentsArgs = {
  where: Erp_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Comments_By_PkArgs = {
  CommentID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_DocsArgs = {
  where: Erp_Docs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Docs_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_NotificationsArgs = {
  where: Erp_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Notifications_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_OrderItemsArgs = {
  where: Erp_OrderItems_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_OrderItems_By_PkArgs = {
  OrderItemID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_OrderStatusArgs = {
  where: Erp_OrderStatus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_OrderStatus_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_OrdersArgs = {
  where: Erp_Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Orders_By_PkArgs = {
  OrderID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_PaymentHistoryArgs = {
  where: Erp_PaymentHistory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_PaymentHistory_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_TokensArgs = {
  where: Erp_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Tokens_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Erp_UsersArgs = {
  where: Erp_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Erp_Users_By_PkArgs = {
  UserID: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Kysely_MigrationArgs = {
  where: Kysely_Migration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Kysely_Migration_By_PkArgs = {
  name: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Kysely_Migration_LockArgs = {
  where: Kysely_Migration_Lock_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Kysely_Migration_Lock_By_PkArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Detail_MaterialsArgs = {
  where: Metal_Pdo_Detail_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_DetailsArgs = {
  where: Metal_Pdo_Details_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_MaterialsArgs = {
  where: Metal_Pdo_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_SuppliesArgs = {
  where: Metal_Pdo_Supplies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_WriteoffsArgs = {
  where: Metal_Pdo_Writeoffs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Pdo_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootInsert_Attendance_ConfigArgs = {
  objects: Array<Attendance_Config_Insert_Input>;
  on_conflict?: InputMaybe<Attendance_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attendance_Config_OneArgs = {
  object: Attendance_Config_Insert_Input;
  on_conflict?: InputMaybe<Attendance_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attendance_IntervalsArgs = {
  objects: Array<Attendance_Intervals_Insert_Input>;
  on_conflict?: InputMaybe<Attendance_Intervals_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attendance_Intervals_OneArgs = {
  object: Attendance_Intervals_Insert_Input;
  on_conflict?: InputMaybe<Attendance_Intervals_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attendance_UsersArgs = {
  objects: Array<Attendance_Users_Insert_Input>;
  on_conflict?: InputMaybe<Attendance_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attendance_Users_OneArgs = {
  object: Attendance_Users_Insert_Input;
  on_conflict?: InputMaybe<Attendance_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_AccessLevelsArgs = {
  objects: Array<Erp_AccessLevels_Insert_Input>;
  on_conflict?: InputMaybe<Erp_AccessLevels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_AccessLevels_OneArgs = {
  object: Erp_AccessLevels_Insert_Input;
  on_conflict?: InputMaybe<Erp_AccessLevels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_CommentsArgs = {
  objects: Array<Erp_Comments_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Comments_OneArgs = {
  object: Erp_Comments_Insert_Input;
  on_conflict?: InputMaybe<Erp_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_DocsArgs = {
  objects: Array<Erp_Docs_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Docs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Docs_OneArgs = {
  object: Erp_Docs_Insert_Input;
  on_conflict?: InputMaybe<Erp_Docs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_NotificationsArgs = {
  objects: Array<Erp_Notifications_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Notifications_OneArgs = {
  object: Erp_Notifications_Insert_Input;
  on_conflict?: InputMaybe<Erp_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_OrderItemsArgs = {
  objects: Array<Erp_OrderItems_Insert_Input>;
  on_conflict?: InputMaybe<Erp_OrderItems_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_OrderItems_OneArgs = {
  object: Erp_OrderItems_Insert_Input;
  on_conflict?: InputMaybe<Erp_OrderItems_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_OrderStatusArgs = {
  objects: Array<Erp_OrderStatus_Insert_Input>;
  on_conflict?: InputMaybe<Erp_OrderStatus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_OrderStatus_OneArgs = {
  object: Erp_OrderStatus_Insert_Input;
  on_conflict?: InputMaybe<Erp_OrderStatus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_OrdersArgs = {
  objects: Array<Erp_Orders_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Orders_OneArgs = {
  object: Erp_Orders_Insert_Input;
  on_conflict?: InputMaybe<Erp_Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_PaymentHistoryArgs = {
  objects: Array<Erp_PaymentHistory_Insert_Input>;
  on_conflict?: InputMaybe<Erp_PaymentHistory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_PaymentHistory_OneArgs = {
  object: Erp_PaymentHistory_Insert_Input;
  on_conflict?: InputMaybe<Erp_PaymentHistory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_TokensArgs = {
  objects: Array<Erp_Tokens_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Tokens_OneArgs = {
  object: Erp_Tokens_Insert_Input;
  on_conflict?: InputMaybe<Erp_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_UsersArgs = {
  objects: Array<Erp_Users_Insert_Input>;
  on_conflict?: InputMaybe<Erp_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Erp_Users_OneArgs = {
  object: Erp_Users_Insert_Input;
  on_conflict?: InputMaybe<Erp_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Kysely_MigrationArgs = {
  objects: Array<Kysely_Migration_Insert_Input>;
  on_conflict?: InputMaybe<Kysely_Migration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Kysely_Migration_LockArgs = {
  objects: Array<Kysely_Migration_Lock_Insert_Input>;
  on_conflict?: InputMaybe<Kysely_Migration_Lock_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Kysely_Migration_Lock_OneArgs = {
  object: Kysely_Migration_Lock_Insert_Input;
  on_conflict?: InputMaybe<Kysely_Migration_Lock_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Kysely_Migration_OneArgs = {
  object: Kysely_Migration_Insert_Input;
  on_conflict?: InputMaybe<Kysely_Migration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Detail_MaterialsArgs = {
  objects: Array<Metal_Pdo_Detail_Materials_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Pdo_Detail_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Detail_Materials_OneArgs = {
  object: Metal_Pdo_Detail_Materials_Insert_Input;
  on_conflict?: InputMaybe<Metal_Pdo_Detail_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_DetailsArgs = {
  objects: Array<Metal_Pdo_Details_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Pdo_Details_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Details_OneArgs = {
  object: Metal_Pdo_Details_Insert_Input;
  on_conflict?: InputMaybe<Metal_Pdo_Details_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_MaterialsArgs = {
  objects: Array<Metal_Pdo_Materials_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Pdo_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Materials_OneArgs = {
  object: Metal_Pdo_Materials_Insert_Input;
  on_conflict?: InputMaybe<Metal_Pdo_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_SuppliesArgs = {
  objects: Array<Metal_Pdo_Supplies_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Pdo_Supplies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Supplies_OneArgs = {
  object: Metal_Pdo_Supplies_Insert_Input;
  on_conflict?: InputMaybe<Metal_Pdo_Supplies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_WriteoffsArgs = {
  objects: Array<Metal_Pdo_Writeoffs_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Pdo_Writeoffs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Pdo_Writeoffs_OneArgs = {
  object: Metal_Pdo_Writeoffs_Insert_Input;
  on_conflict?: InputMaybe<Metal_Pdo_Writeoffs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_ConfigArgs = {
  _inc?: InputMaybe<Attendance_Config_Inc_Input>;
  _set?: InputMaybe<Attendance_Config_Set_Input>;
  where: Attendance_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Config_By_PkArgs = {
  _inc?: InputMaybe<Attendance_Config_Inc_Input>;
  _set?: InputMaybe<Attendance_Config_Set_Input>;
  pk_columns: Attendance_Config_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Config_ManyArgs = {
  updates: Array<Attendance_Config_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_IntervalsArgs = {
  _inc?: InputMaybe<Attendance_Intervals_Inc_Input>;
  _set?: InputMaybe<Attendance_Intervals_Set_Input>;
  where: Attendance_Intervals_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Intervals_By_PkArgs = {
  _inc?: InputMaybe<Attendance_Intervals_Inc_Input>;
  _set?: InputMaybe<Attendance_Intervals_Set_Input>;
  pk_columns: Attendance_Intervals_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Intervals_ManyArgs = {
  updates: Array<Attendance_Intervals_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_UsersArgs = {
  _inc?: InputMaybe<Attendance_Users_Inc_Input>;
  _set?: InputMaybe<Attendance_Users_Set_Input>;
  where: Attendance_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Users_By_PkArgs = {
  _inc?: InputMaybe<Attendance_Users_Inc_Input>;
  _set?: InputMaybe<Attendance_Users_Set_Input>;
  pk_columns: Attendance_Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Attendance_Users_ManyArgs = {
  updates: Array<Attendance_Users_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_AccessLevelsArgs = {
  _inc?: InputMaybe<Erp_AccessLevels_Inc_Input>;
  _set?: InputMaybe<Erp_AccessLevels_Set_Input>;
  where: Erp_AccessLevels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_AccessLevels_By_PkArgs = {
  _inc?: InputMaybe<Erp_AccessLevels_Inc_Input>;
  _set?: InputMaybe<Erp_AccessLevels_Set_Input>;
  pk_columns: Erp_AccessLevels_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_AccessLevels_ManyArgs = {
  updates: Array<Erp_AccessLevels_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_CommentsArgs = {
  _inc?: InputMaybe<Erp_Comments_Inc_Input>;
  _set?: InputMaybe<Erp_Comments_Set_Input>;
  where: Erp_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Comments_By_PkArgs = {
  _inc?: InputMaybe<Erp_Comments_Inc_Input>;
  _set?: InputMaybe<Erp_Comments_Set_Input>;
  pk_columns: Erp_Comments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Comments_ManyArgs = {
  updates: Array<Erp_Comments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_DocsArgs = {
  _inc?: InputMaybe<Erp_Docs_Inc_Input>;
  _set?: InputMaybe<Erp_Docs_Set_Input>;
  where: Erp_Docs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Docs_By_PkArgs = {
  _inc?: InputMaybe<Erp_Docs_Inc_Input>;
  _set?: InputMaybe<Erp_Docs_Set_Input>;
  pk_columns: Erp_Docs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Docs_ManyArgs = {
  updates: Array<Erp_Docs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_NotificationsArgs = {
  _inc?: InputMaybe<Erp_Notifications_Inc_Input>;
  _set?: InputMaybe<Erp_Notifications_Set_Input>;
  where: Erp_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Notifications_By_PkArgs = {
  _inc?: InputMaybe<Erp_Notifications_Inc_Input>;
  _set?: InputMaybe<Erp_Notifications_Set_Input>;
  pk_columns: Erp_Notifications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Notifications_ManyArgs = {
  updates: Array<Erp_Notifications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderItemsArgs = {
  _inc?: InputMaybe<Erp_OrderItems_Inc_Input>;
  _set?: InputMaybe<Erp_OrderItems_Set_Input>;
  where: Erp_OrderItems_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderItems_By_PkArgs = {
  _inc?: InputMaybe<Erp_OrderItems_Inc_Input>;
  _set?: InputMaybe<Erp_OrderItems_Set_Input>;
  pk_columns: Erp_OrderItems_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderItems_ManyArgs = {
  updates: Array<Erp_OrderItems_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderStatusArgs = {
  _inc?: InputMaybe<Erp_OrderStatus_Inc_Input>;
  _set?: InputMaybe<Erp_OrderStatus_Set_Input>;
  where: Erp_OrderStatus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderStatus_By_PkArgs = {
  _inc?: InputMaybe<Erp_OrderStatus_Inc_Input>;
  _set?: InputMaybe<Erp_OrderStatus_Set_Input>;
  pk_columns: Erp_OrderStatus_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrderStatus_ManyArgs = {
  updates: Array<Erp_OrderStatus_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_OrdersArgs = {
  _inc?: InputMaybe<Erp_Orders_Inc_Input>;
  _set?: InputMaybe<Erp_Orders_Set_Input>;
  where: Erp_Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Orders_By_PkArgs = {
  _inc?: InputMaybe<Erp_Orders_Inc_Input>;
  _set?: InputMaybe<Erp_Orders_Set_Input>;
  pk_columns: Erp_Orders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Orders_ManyArgs = {
  updates: Array<Erp_Orders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_PaymentHistoryArgs = {
  _inc?: InputMaybe<Erp_PaymentHistory_Inc_Input>;
  _set?: InputMaybe<Erp_PaymentHistory_Set_Input>;
  where: Erp_PaymentHistory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_PaymentHistory_By_PkArgs = {
  _inc?: InputMaybe<Erp_PaymentHistory_Inc_Input>;
  _set?: InputMaybe<Erp_PaymentHistory_Set_Input>;
  pk_columns: Erp_PaymentHistory_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_PaymentHistory_ManyArgs = {
  updates: Array<Erp_PaymentHistory_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_TokensArgs = {
  _inc?: InputMaybe<Erp_Tokens_Inc_Input>;
  _set?: InputMaybe<Erp_Tokens_Set_Input>;
  where: Erp_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Tokens_By_PkArgs = {
  _inc?: InputMaybe<Erp_Tokens_Inc_Input>;
  _set?: InputMaybe<Erp_Tokens_Set_Input>;
  pk_columns: Erp_Tokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Tokens_ManyArgs = {
  updates: Array<Erp_Tokens_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_UsersArgs = {
  _inc?: InputMaybe<Erp_Users_Inc_Input>;
  _set?: InputMaybe<Erp_Users_Set_Input>;
  where: Erp_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Users_By_PkArgs = {
  _inc?: InputMaybe<Erp_Users_Inc_Input>;
  _set?: InputMaybe<Erp_Users_Set_Input>;
  pk_columns: Erp_Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Erp_Users_ManyArgs = {
  updates: Array<Erp_Users_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_MigrationArgs = {
  _set?: InputMaybe<Kysely_Migration_Set_Input>;
  where: Kysely_Migration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_Migration_By_PkArgs = {
  _set?: InputMaybe<Kysely_Migration_Set_Input>;
  pk_columns: Kysely_Migration_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_Migration_LockArgs = {
  _inc?: InputMaybe<Kysely_Migration_Lock_Inc_Input>;
  _set?: InputMaybe<Kysely_Migration_Lock_Set_Input>;
  where: Kysely_Migration_Lock_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_Migration_Lock_By_PkArgs = {
  _inc?: InputMaybe<Kysely_Migration_Lock_Inc_Input>;
  _set?: InputMaybe<Kysely_Migration_Lock_Set_Input>;
  pk_columns: Kysely_Migration_Lock_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_Migration_Lock_ManyArgs = {
  updates: Array<Kysely_Migration_Lock_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Kysely_Migration_ManyArgs = {
  updates: Array<Kysely_Migration_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Detail_MaterialsArgs = {
  _inc?: InputMaybe<Metal_Pdo_Detail_Materials_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Detail_Materials_Set_Input>;
  where: Metal_Pdo_Detail_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Detail_Materials_By_PkArgs = {
  _inc?: InputMaybe<Metal_Pdo_Detail_Materials_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Detail_Materials_Set_Input>;
  pk_columns: Metal_Pdo_Detail_Materials_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Detail_Materials_ManyArgs = {
  updates: Array<Metal_Pdo_Detail_Materials_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_DetailsArgs = {
  _inc?: InputMaybe<Metal_Pdo_Details_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Details_Set_Input>;
  where: Metal_Pdo_Details_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Details_By_PkArgs = {
  _inc?: InputMaybe<Metal_Pdo_Details_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Details_Set_Input>;
  pk_columns: Metal_Pdo_Details_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Details_ManyArgs = {
  updates: Array<Metal_Pdo_Details_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_MaterialsArgs = {
  _append?: InputMaybe<Metal_Pdo_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Pdo_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Pdo_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Pdo_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Pdo_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Pdo_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Pdo_Materials_Set_Input>;
  where: Metal_Pdo_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Materials_By_PkArgs = {
  _append?: InputMaybe<Metal_Pdo_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Pdo_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Pdo_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Pdo_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Pdo_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Pdo_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Pdo_Materials_Set_Input>;
  pk_columns: Metal_Pdo_Materials_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Materials_ManyArgs = {
  updates: Array<Metal_Pdo_Materials_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_SuppliesArgs = {
  _inc?: InputMaybe<Metal_Pdo_Supplies_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Supplies_Set_Input>;
  where: Metal_Pdo_Supplies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Supplies_By_PkArgs = {
  _inc?: InputMaybe<Metal_Pdo_Supplies_Inc_Input>;
  _set?: InputMaybe<Metal_Pdo_Supplies_Set_Input>;
  pk_columns: Metal_Pdo_Supplies_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Supplies_ManyArgs = {
  updates: Array<Metal_Pdo_Supplies_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_WriteoffsArgs = {
  _append?: InputMaybe<Metal_Pdo_Writeoffs_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Pdo_Writeoffs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Pdo_Writeoffs_Inc_Input>;
  _prepend?: InputMaybe<Metal_Pdo_Writeoffs_Prepend_Input>;
  _set?: InputMaybe<Metal_Pdo_Writeoffs_Set_Input>;
  where: Metal_Pdo_Writeoffs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Writeoffs_By_PkArgs = {
  _append?: InputMaybe<Metal_Pdo_Writeoffs_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Pdo_Writeoffs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Pdo_Writeoffs_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Pdo_Writeoffs_Inc_Input>;
  _prepend?: InputMaybe<Metal_Pdo_Writeoffs_Prepend_Input>;
  _set?: InputMaybe<Metal_Pdo_Writeoffs_Set_Input>;
  pk_columns: Metal_Pdo_Writeoffs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Pdo_Writeoffs_ManyArgs = {
  updates: Array<Metal_Pdo_Writeoffs_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "attendance.config" */
  attendance_config: Array<Attendance_Config>;
  /** fetch aggregated fields from the table: "attendance.config" */
  attendance_config_aggregate: Attendance_Config_Aggregate;
  /** fetch data from the table: "attendance.config" using primary key columns */
  attendance_config_by_pk?: Maybe<Attendance_Config>;
  /** fetch data from the table: "attendance.intervals" */
  attendance_intervals: Array<Attendance_Intervals>;
  /** fetch aggregated fields from the table: "attendance.intervals" */
  attendance_intervals_aggregate: Attendance_Intervals_Aggregate;
  /** fetch data from the table: "attendance.intervals" using primary key columns */
  attendance_intervals_by_pk?: Maybe<Attendance_Intervals>;
  /** fetch data from the table: "attendance.users" */
  attendance_users: Array<Attendance_Users>;
  /** fetch aggregated fields from the table: "attendance.users" */
  attendance_users_aggregate: Attendance_Users_Aggregate;
  /** fetch data from the table: "attendance.users" using primary key columns */
  attendance_users_by_pk?: Maybe<Attendance_Users>;
  /** fetch data from the table: "erp.AccessLevels" */
  erp_AccessLevels: Array<Erp_AccessLevels>;
  /** fetch aggregated fields from the table: "erp.AccessLevels" */
  erp_AccessLevels_aggregate: Erp_AccessLevels_Aggregate;
  /** fetch data from the table: "erp.AccessLevels" using primary key columns */
  erp_AccessLevels_by_pk?: Maybe<Erp_AccessLevels>;
  /** fetch data from the table: "erp.Comments" */
  erp_Comments: Array<Erp_Comments>;
  /** fetch aggregated fields from the table: "erp.Comments" */
  erp_Comments_aggregate: Erp_Comments_Aggregate;
  /** fetch data from the table: "erp.Comments" using primary key columns */
  erp_Comments_by_pk?: Maybe<Erp_Comments>;
  /** fetch data from the table: "erp.Docs" */
  erp_Docs: Array<Erp_Docs>;
  /** fetch aggregated fields from the table: "erp.Docs" */
  erp_Docs_aggregate: Erp_Docs_Aggregate;
  /** fetch data from the table: "erp.Docs" using primary key columns */
  erp_Docs_by_pk?: Maybe<Erp_Docs>;
  /** fetch data from the table: "erp.Notifications" */
  erp_Notifications: Array<Erp_Notifications>;
  /** fetch aggregated fields from the table: "erp.Notifications" */
  erp_Notifications_aggregate: Erp_Notifications_Aggregate;
  /** fetch data from the table: "erp.Notifications" using primary key columns */
  erp_Notifications_by_pk?: Maybe<Erp_Notifications>;
  /** fetch data from the table: "erp.OrderItems" */
  erp_OrderItems: Array<Erp_OrderItems>;
  /** fetch aggregated fields from the table: "erp.OrderItems" */
  erp_OrderItems_aggregate: Erp_OrderItems_Aggregate;
  /** fetch data from the table: "erp.OrderItems" using primary key columns */
  erp_OrderItems_by_pk?: Maybe<Erp_OrderItems>;
  /** fetch data from the table: "erp.OrderStatus" */
  erp_OrderStatus: Array<Erp_OrderStatus>;
  /** fetch aggregated fields from the table: "erp.OrderStatus" */
  erp_OrderStatus_aggregate: Erp_OrderStatus_Aggregate;
  /** fetch data from the table: "erp.OrderStatus" using primary key columns */
  erp_OrderStatus_by_pk?: Maybe<Erp_OrderStatus>;
  /** fetch data from the table: "erp.Orders" */
  erp_Orders: Array<Erp_Orders>;
  /** fetch aggregated fields from the table: "erp.Orders" */
  erp_Orders_aggregate: Erp_Orders_Aggregate;
  /** fetch data from the table: "erp.Orders" using primary key columns */
  erp_Orders_by_pk?: Maybe<Erp_Orders>;
  /** fetch data from the table: "erp.PaymentHistory" */
  erp_PaymentHistory: Array<Erp_PaymentHistory>;
  /** fetch aggregated fields from the table: "erp.PaymentHistory" */
  erp_PaymentHistory_aggregate: Erp_PaymentHistory_Aggregate;
  /** fetch data from the table: "erp.PaymentHistory" using primary key columns */
  erp_PaymentHistory_by_pk?: Maybe<Erp_PaymentHistory>;
  /** fetch data from the table: "erp.Tokens" */
  erp_Tokens: Array<Erp_Tokens>;
  /** fetch aggregated fields from the table: "erp.Tokens" */
  erp_Tokens_aggregate: Erp_Tokens_Aggregate;
  /** fetch data from the table: "erp.Tokens" using primary key columns */
  erp_Tokens_by_pk?: Maybe<Erp_Tokens>;
  /** fetch data from the table: "erp.Users" */
  erp_Users: Array<Erp_Users>;
  /** fetch aggregated fields from the table: "erp.Users" */
  erp_Users_aggregate: Erp_Users_Aggregate;
  /** fetch data from the table: "erp.Users" using primary key columns */
  erp_Users_by_pk?: Maybe<Erp_Users>;
  /** fetch data from the table: "kysely_migration" */
  kysely_migration: Array<Kysely_Migration>;
  /** fetch aggregated fields from the table: "kysely_migration" */
  kysely_migration_aggregate: Kysely_Migration_Aggregate;
  /** fetch data from the table: "kysely_migration" using primary key columns */
  kysely_migration_by_pk?: Maybe<Kysely_Migration>;
  /** fetch data from the table: "kysely_migration_lock" */
  kysely_migration_lock: Array<Kysely_Migration_Lock>;
  /** fetch aggregated fields from the table: "kysely_migration_lock" */
  kysely_migration_lock_aggregate: Kysely_Migration_Lock_Aggregate;
  /** fetch data from the table: "kysely_migration_lock" using primary key columns */
  kysely_migration_lock_by_pk?: Maybe<Kysely_Migration_Lock>;
  /** fetch data from the table: "metal_pdo.detail_materials" */
  metal_pdo_detail_materials: Array<Metal_Pdo_Detail_Materials>;
  /** fetch aggregated fields from the table: "metal_pdo.detail_materials" */
  metal_pdo_detail_materials_aggregate: Metal_Pdo_Detail_Materials_Aggregate;
  /** fetch data from the table: "metal_pdo.detail_materials" using primary key columns */
  metal_pdo_detail_materials_by_pk?: Maybe<Metal_Pdo_Detail_Materials>;
  /** fetch data from the table: "metal_pdo.details" */
  metal_pdo_details: Array<Metal_Pdo_Details>;
  /** fetch aggregated fields from the table: "metal_pdo.details" */
  metal_pdo_details_aggregate: Metal_Pdo_Details_Aggregate;
  /** fetch data from the table: "metal_pdo.details" using primary key columns */
  metal_pdo_details_by_pk?: Maybe<Metal_Pdo_Details>;
  /** fetch data from the table: "metal_pdo.materials" */
  metal_pdo_materials: Array<Metal_Pdo_Materials>;
  /** fetch aggregated fields from the table: "metal_pdo.materials" */
  metal_pdo_materials_aggregate: Metal_Pdo_Materials_Aggregate;
  /** fetch data from the table: "metal_pdo.materials" using primary key columns */
  metal_pdo_materials_by_pk?: Maybe<Metal_Pdo_Materials>;
  /** fetch data from the table: "metal_pdo.supplies" */
  metal_pdo_supplies: Array<Metal_Pdo_Supplies>;
  /** fetch aggregated fields from the table: "metal_pdo.supplies" */
  metal_pdo_supplies_aggregate: Metal_Pdo_Supplies_Aggregate;
  /** fetch data from the table: "metal_pdo.supplies" using primary key columns */
  metal_pdo_supplies_by_pk?: Maybe<Metal_Pdo_Supplies>;
  /** fetch data from the table: "metal_pdo.writeoffs" */
  metal_pdo_writeoffs: Array<Metal_Pdo_Writeoffs>;
  /** fetch aggregated fields from the table: "metal_pdo.writeoffs" */
  metal_pdo_writeoffs_aggregate: Metal_Pdo_Writeoffs_Aggregate;
  /** fetch data from the table: "metal_pdo.writeoffs" using primary key columns */
  metal_pdo_writeoffs_by_pk?: Maybe<Metal_Pdo_Writeoffs>;
};


export type Query_RootAttendance_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Config_Order_By>>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};


export type Query_RootAttendance_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Config_Order_By>>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};


export type Query_RootAttendance_Config_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootAttendance_IntervalsArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


export type Query_RootAttendance_Intervals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


export type Query_RootAttendance_Intervals_By_PkArgs = {
  card: Scalars['String']['input'];
  ent_event_id: Scalars['Int']['input'];
};


export type Query_RootAttendance_UsersArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Users_Order_By>>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};


export type Query_RootAttendance_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Users_Order_By>>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};


export type Query_RootAttendance_Users_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootErp_AccessLevelsArgs = {
  distinct_on?: InputMaybe<Array<Erp_AccessLevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_AccessLevels_Order_By>>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};


export type Query_RootErp_AccessLevels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_AccessLevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_AccessLevels_Order_By>>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};


export type Query_RootErp_AccessLevels_By_PkArgs = {
  AccessLevelID: Scalars['Int']['input'];
};


export type Query_RootErp_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


export type Query_RootErp_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


export type Query_RootErp_Comments_By_PkArgs = {
  CommentID: Scalars['Int']['input'];
};


export type Query_RootErp_DocsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


export type Query_RootErp_Docs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


export type Query_RootErp_Docs_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootErp_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


export type Query_RootErp_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


export type Query_RootErp_Notifications_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootErp_OrderItemsArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


export type Query_RootErp_OrderItems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


export type Query_RootErp_OrderItems_By_PkArgs = {
  OrderItemID: Scalars['Int']['input'];
};


export type Query_RootErp_OrderStatusArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderStatus_Order_By>>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};


export type Query_RootErp_OrderStatus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderStatus_Order_By>>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};


export type Query_RootErp_OrderStatus_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootErp_OrdersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


export type Query_RootErp_Orders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


export type Query_RootErp_Orders_By_PkArgs = {
  OrderID: Scalars['Int']['input'];
};


export type Query_RootErp_PaymentHistoryArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


export type Query_RootErp_PaymentHistory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


export type Query_RootErp_PaymentHistory_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootErp_TokensArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


export type Query_RootErp_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


export type Query_RootErp_Tokens_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Query_RootErp_UsersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


export type Query_RootErp_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


export type Query_RootErp_Users_By_PkArgs = {
  UserID: Scalars['Int']['input'];
};


export type Query_RootKysely_MigrationArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};


export type Query_RootKysely_Migration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};


export type Query_RootKysely_Migration_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Query_RootKysely_Migration_LockArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Lock_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Lock_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};


export type Query_RootKysely_Migration_Lock_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Lock_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Lock_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};


export type Query_RootKysely_Migration_Lock_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootMetal_Pdo_Detail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Detail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


export type Query_RootMetal_Pdo_DetailsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Details_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Details_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Details_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Pdo_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Pdo_SuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Supplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Pdo_WriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Writeoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};


export type Query_RootMetal_Pdo_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "attendance.config" */
  attendance_config: Array<Attendance_Config>;
  /** fetch aggregated fields from the table: "attendance.config" */
  attendance_config_aggregate: Attendance_Config_Aggregate;
  /** fetch data from the table: "attendance.config" using primary key columns */
  attendance_config_by_pk?: Maybe<Attendance_Config>;
  /** fetch data from the table in a streaming manner: "attendance.config" */
  attendance_config_stream: Array<Attendance_Config>;
  /** fetch data from the table: "attendance.intervals" */
  attendance_intervals: Array<Attendance_Intervals>;
  /** fetch aggregated fields from the table: "attendance.intervals" */
  attendance_intervals_aggregate: Attendance_Intervals_Aggregate;
  /** fetch data from the table: "attendance.intervals" using primary key columns */
  attendance_intervals_by_pk?: Maybe<Attendance_Intervals>;
  /** fetch data from the table in a streaming manner: "attendance.intervals" */
  attendance_intervals_stream: Array<Attendance_Intervals>;
  /** fetch data from the table: "attendance.users" */
  attendance_users: Array<Attendance_Users>;
  /** fetch aggregated fields from the table: "attendance.users" */
  attendance_users_aggregate: Attendance_Users_Aggregate;
  /** fetch data from the table: "attendance.users" using primary key columns */
  attendance_users_by_pk?: Maybe<Attendance_Users>;
  /** fetch data from the table in a streaming manner: "attendance.users" */
  attendance_users_stream: Array<Attendance_Users>;
  /** fetch data from the table: "erp.AccessLevels" */
  erp_AccessLevels: Array<Erp_AccessLevels>;
  /** fetch aggregated fields from the table: "erp.AccessLevels" */
  erp_AccessLevels_aggregate: Erp_AccessLevels_Aggregate;
  /** fetch data from the table: "erp.AccessLevels" using primary key columns */
  erp_AccessLevels_by_pk?: Maybe<Erp_AccessLevels>;
  /** fetch data from the table in a streaming manner: "erp.AccessLevels" */
  erp_AccessLevels_stream: Array<Erp_AccessLevels>;
  /** fetch data from the table: "erp.Comments" */
  erp_Comments: Array<Erp_Comments>;
  /** fetch aggregated fields from the table: "erp.Comments" */
  erp_Comments_aggregate: Erp_Comments_Aggregate;
  /** fetch data from the table: "erp.Comments" using primary key columns */
  erp_Comments_by_pk?: Maybe<Erp_Comments>;
  /** fetch data from the table in a streaming manner: "erp.Comments" */
  erp_Comments_stream: Array<Erp_Comments>;
  /** fetch data from the table: "erp.Docs" */
  erp_Docs: Array<Erp_Docs>;
  /** fetch aggregated fields from the table: "erp.Docs" */
  erp_Docs_aggregate: Erp_Docs_Aggregate;
  /** fetch data from the table: "erp.Docs" using primary key columns */
  erp_Docs_by_pk?: Maybe<Erp_Docs>;
  /** fetch data from the table in a streaming manner: "erp.Docs" */
  erp_Docs_stream: Array<Erp_Docs>;
  /** fetch data from the table: "erp.Notifications" */
  erp_Notifications: Array<Erp_Notifications>;
  /** fetch aggregated fields from the table: "erp.Notifications" */
  erp_Notifications_aggregate: Erp_Notifications_Aggregate;
  /** fetch data from the table: "erp.Notifications" using primary key columns */
  erp_Notifications_by_pk?: Maybe<Erp_Notifications>;
  /** fetch data from the table in a streaming manner: "erp.Notifications" */
  erp_Notifications_stream: Array<Erp_Notifications>;
  /** fetch data from the table: "erp.OrderItems" */
  erp_OrderItems: Array<Erp_OrderItems>;
  /** fetch aggregated fields from the table: "erp.OrderItems" */
  erp_OrderItems_aggregate: Erp_OrderItems_Aggregate;
  /** fetch data from the table: "erp.OrderItems" using primary key columns */
  erp_OrderItems_by_pk?: Maybe<Erp_OrderItems>;
  /** fetch data from the table in a streaming manner: "erp.OrderItems" */
  erp_OrderItems_stream: Array<Erp_OrderItems>;
  /** fetch data from the table: "erp.OrderStatus" */
  erp_OrderStatus: Array<Erp_OrderStatus>;
  /** fetch aggregated fields from the table: "erp.OrderStatus" */
  erp_OrderStatus_aggregate: Erp_OrderStatus_Aggregate;
  /** fetch data from the table: "erp.OrderStatus" using primary key columns */
  erp_OrderStatus_by_pk?: Maybe<Erp_OrderStatus>;
  /** fetch data from the table in a streaming manner: "erp.OrderStatus" */
  erp_OrderStatus_stream: Array<Erp_OrderStatus>;
  /** fetch data from the table: "erp.Orders" */
  erp_Orders: Array<Erp_Orders>;
  /** fetch aggregated fields from the table: "erp.Orders" */
  erp_Orders_aggregate: Erp_Orders_Aggregate;
  /** fetch data from the table: "erp.Orders" using primary key columns */
  erp_Orders_by_pk?: Maybe<Erp_Orders>;
  /** fetch data from the table in a streaming manner: "erp.Orders" */
  erp_Orders_stream: Array<Erp_Orders>;
  /** fetch data from the table: "erp.PaymentHistory" */
  erp_PaymentHistory: Array<Erp_PaymentHistory>;
  /** fetch aggregated fields from the table: "erp.PaymentHistory" */
  erp_PaymentHistory_aggregate: Erp_PaymentHistory_Aggregate;
  /** fetch data from the table: "erp.PaymentHistory" using primary key columns */
  erp_PaymentHistory_by_pk?: Maybe<Erp_PaymentHistory>;
  /** fetch data from the table in a streaming manner: "erp.PaymentHistory" */
  erp_PaymentHistory_stream: Array<Erp_PaymentHistory>;
  /** fetch data from the table: "erp.Tokens" */
  erp_Tokens: Array<Erp_Tokens>;
  /** fetch aggregated fields from the table: "erp.Tokens" */
  erp_Tokens_aggregate: Erp_Tokens_Aggregate;
  /** fetch data from the table: "erp.Tokens" using primary key columns */
  erp_Tokens_by_pk?: Maybe<Erp_Tokens>;
  /** fetch data from the table in a streaming manner: "erp.Tokens" */
  erp_Tokens_stream: Array<Erp_Tokens>;
  /** fetch data from the table: "erp.Users" */
  erp_Users: Array<Erp_Users>;
  /** fetch aggregated fields from the table: "erp.Users" */
  erp_Users_aggregate: Erp_Users_Aggregate;
  /** fetch data from the table: "erp.Users" using primary key columns */
  erp_Users_by_pk?: Maybe<Erp_Users>;
  /** fetch data from the table in a streaming manner: "erp.Users" */
  erp_Users_stream: Array<Erp_Users>;
  /** fetch data from the table: "kysely_migration" */
  kysely_migration: Array<Kysely_Migration>;
  /** fetch aggregated fields from the table: "kysely_migration" */
  kysely_migration_aggregate: Kysely_Migration_Aggregate;
  /** fetch data from the table: "kysely_migration" using primary key columns */
  kysely_migration_by_pk?: Maybe<Kysely_Migration>;
  /** fetch data from the table: "kysely_migration_lock" */
  kysely_migration_lock: Array<Kysely_Migration_Lock>;
  /** fetch aggregated fields from the table: "kysely_migration_lock" */
  kysely_migration_lock_aggregate: Kysely_Migration_Lock_Aggregate;
  /** fetch data from the table: "kysely_migration_lock" using primary key columns */
  kysely_migration_lock_by_pk?: Maybe<Kysely_Migration_Lock>;
  /** fetch data from the table in a streaming manner: "kysely_migration_lock" */
  kysely_migration_lock_stream: Array<Kysely_Migration_Lock>;
  /** fetch data from the table in a streaming manner: "kysely_migration" */
  kysely_migration_stream: Array<Kysely_Migration>;
  /** fetch data from the table: "metal_pdo.detail_materials" */
  metal_pdo_detail_materials: Array<Metal_Pdo_Detail_Materials>;
  /** fetch aggregated fields from the table: "metal_pdo.detail_materials" */
  metal_pdo_detail_materials_aggregate: Metal_Pdo_Detail_Materials_Aggregate;
  /** fetch data from the table: "metal_pdo.detail_materials" using primary key columns */
  metal_pdo_detail_materials_by_pk?: Maybe<Metal_Pdo_Detail_Materials>;
  /** fetch data from the table in a streaming manner: "metal_pdo.detail_materials" */
  metal_pdo_detail_materials_stream: Array<Metal_Pdo_Detail_Materials>;
  /** fetch data from the table: "metal_pdo.details" */
  metal_pdo_details: Array<Metal_Pdo_Details>;
  /** fetch aggregated fields from the table: "metal_pdo.details" */
  metal_pdo_details_aggregate: Metal_Pdo_Details_Aggregate;
  /** fetch data from the table: "metal_pdo.details" using primary key columns */
  metal_pdo_details_by_pk?: Maybe<Metal_Pdo_Details>;
  /** fetch data from the table in a streaming manner: "metal_pdo.details" */
  metal_pdo_details_stream: Array<Metal_Pdo_Details>;
  /** fetch data from the table: "metal_pdo.materials" */
  metal_pdo_materials: Array<Metal_Pdo_Materials>;
  /** fetch aggregated fields from the table: "metal_pdo.materials" */
  metal_pdo_materials_aggregate: Metal_Pdo_Materials_Aggregate;
  /** fetch data from the table: "metal_pdo.materials" using primary key columns */
  metal_pdo_materials_by_pk?: Maybe<Metal_Pdo_Materials>;
  /** fetch data from the table in a streaming manner: "metal_pdo.materials" */
  metal_pdo_materials_stream: Array<Metal_Pdo_Materials>;
  /** fetch data from the table: "metal_pdo.supplies" */
  metal_pdo_supplies: Array<Metal_Pdo_Supplies>;
  /** fetch aggregated fields from the table: "metal_pdo.supplies" */
  metal_pdo_supplies_aggregate: Metal_Pdo_Supplies_Aggregate;
  /** fetch data from the table: "metal_pdo.supplies" using primary key columns */
  metal_pdo_supplies_by_pk?: Maybe<Metal_Pdo_Supplies>;
  /** fetch data from the table in a streaming manner: "metal_pdo.supplies" */
  metal_pdo_supplies_stream: Array<Metal_Pdo_Supplies>;
  /** fetch data from the table: "metal_pdo.writeoffs" */
  metal_pdo_writeoffs: Array<Metal_Pdo_Writeoffs>;
  /** fetch aggregated fields from the table: "metal_pdo.writeoffs" */
  metal_pdo_writeoffs_aggregate: Metal_Pdo_Writeoffs_Aggregate;
  /** fetch data from the table: "metal_pdo.writeoffs" using primary key columns */
  metal_pdo_writeoffs_by_pk?: Maybe<Metal_Pdo_Writeoffs>;
  /** fetch data from the table in a streaming manner: "metal_pdo.writeoffs" */
  metal_pdo_writeoffs_stream: Array<Metal_Pdo_Writeoffs>;
};


export type Subscription_RootAttendance_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Config_Order_By>>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};


export type Subscription_RootAttendance_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Config_Order_By>>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};


export type Subscription_RootAttendance_Config_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootAttendance_Config_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Attendance_Config_Stream_Cursor_Input>>;
  where?: InputMaybe<Attendance_Config_Bool_Exp>;
};


export type Subscription_RootAttendance_IntervalsArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


export type Subscription_RootAttendance_Intervals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Intervals_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Intervals_Order_By>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


export type Subscription_RootAttendance_Intervals_By_PkArgs = {
  card: Scalars['String']['input'];
  ent_event_id: Scalars['Int']['input'];
};


export type Subscription_RootAttendance_Intervals_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Attendance_Intervals_Stream_Cursor_Input>>;
  where?: InputMaybe<Attendance_Intervals_Bool_Exp>;
};


export type Subscription_RootAttendance_UsersArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Users_Order_By>>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};


export type Subscription_RootAttendance_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attendance_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attendance_Users_Order_By>>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};


export type Subscription_RootAttendance_Users_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootAttendance_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Attendance_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Attendance_Users_Bool_Exp>;
};


export type Subscription_RootErp_AccessLevelsArgs = {
  distinct_on?: InputMaybe<Array<Erp_AccessLevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_AccessLevels_Order_By>>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};


export type Subscription_RootErp_AccessLevels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_AccessLevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_AccessLevels_Order_By>>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};


export type Subscription_RootErp_AccessLevels_By_PkArgs = {
  AccessLevelID: Scalars['Int']['input'];
};


export type Subscription_RootErp_AccessLevels_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_AccessLevels_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_AccessLevels_Bool_Exp>;
};


export type Subscription_RootErp_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


export type Subscription_RootErp_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Comments_Order_By>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


export type Subscription_RootErp_Comments_By_PkArgs = {
  CommentID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Comments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Comments_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Comments_Bool_Exp>;
};


export type Subscription_RootErp_DocsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


export type Subscription_RootErp_Docs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Docs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Docs_Order_By>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


export type Subscription_RootErp_Docs_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Docs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Docs_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Docs_Bool_Exp>;
};


export type Subscription_RootErp_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


export type Subscription_RootErp_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Notifications_Order_By>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


export type Subscription_RootErp_Notifications_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Notifications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Notifications_Bool_Exp>;
};


export type Subscription_RootErp_OrderItemsArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


export type Subscription_RootErp_OrderItems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderItems_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderItems_Order_By>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


export type Subscription_RootErp_OrderItems_By_PkArgs = {
  OrderItemID: Scalars['Int']['input'];
};


export type Subscription_RootErp_OrderItems_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_OrderItems_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_OrderItems_Bool_Exp>;
};


export type Subscription_RootErp_OrderStatusArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderStatus_Order_By>>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};


export type Subscription_RootErp_OrderStatus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_OrderStatus_Order_By>>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};


export type Subscription_RootErp_OrderStatus_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootErp_OrderStatus_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_OrderStatus_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_OrderStatus_Bool_Exp>;
};


export type Subscription_RootErp_OrdersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


export type Subscription_RootErp_Orders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Orders_Order_By>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


export type Subscription_RootErp_Orders_By_PkArgs = {
  OrderID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Orders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Orders_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Orders_Bool_Exp>;
};


export type Subscription_RootErp_PaymentHistoryArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


export type Subscription_RootErp_PaymentHistory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_PaymentHistory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_PaymentHistory_Order_By>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


export type Subscription_RootErp_PaymentHistory_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootErp_PaymentHistory_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_PaymentHistory_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_PaymentHistory_Bool_Exp>;
};


export type Subscription_RootErp_TokensArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


export type Subscription_RootErp_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Tokens_Order_By>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


export type Subscription_RootErp_Tokens_By_PkArgs = {
  ID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Tokens_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Tokens_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Tokens_Bool_Exp>;
};


export type Subscription_RootErp_UsersArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


export type Subscription_RootErp_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Erp_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Erp_Users_Order_By>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


export type Subscription_RootErp_Users_By_PkArgs = {
  UserID: Scalars['Int']['input'];
};


export type Subscription_RootErp_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Erp_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Erp_Users_Bool_Exp>;
};


export type Subscription_RootKysely_MigrationArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};


export type Subscription_RootKysely_Migration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};


export type Subscription_RootKysely_Migration_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Subscription_RootKysely_Migration_LockArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Lock_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Lock_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};


export type Subscription_RootKysely_Migration_Lock_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kysely_Migration_Lock_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Kysely_Migration_Lock_Order_By>>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};


export type Subscription_RootKysely_Migration_Lock_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootKysely_Migration_Lock_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Kysely_Migration_Lock_Stream_Cursor_Input>>;
  where?: InputMaybe<Kysely_Migration_Lock_Bool_Exp>;
};


export type Subscription_RootKysely_Migration_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Kysely_Migration_Stream_Cursor_Input>>;
  where?: InputMaybe<Kysely_Migration_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Detail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Detail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Pdo_Detail_Materials_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Pdo_Detail_Materials_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Pdo_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_DetailsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Details_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Details_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Details_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Pdo_Details_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Pdo_Details_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Pdo_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Materials_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Pdo_Materials_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Pdo_Materials_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Pdo_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_SuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Supplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Pdo_Supplies_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Pdo_Supplies_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Pdo_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_WriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Writeoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Pdo_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Pdo_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};


export type Subscription_RootMetal_Pdo_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Pdo_Writeoffs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Pdo_Writeoffs_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Pdo_Writeoffs_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type GetEmployeeListQueryVariables = Exact<{
  gte: Scalars['timestamp']['input'];
  lte: Scalars['timestamp']['input'];
}>;


export type GetEmployeeListQuery = { __typename?: 'query_root', attendance_users_aggregate: { __typename?: 'attendance_users_aggregate', nodes: Array<{ __typename?: 'attendance_users', id: number, card?: string | null, firstname?: string | null, lastname?: string | null, intervals: Array<{ __typename?: 'attendance_intervals', ent?: any | null, ext?: any | null, card: string }> }> }, attendance_config: Array<{ __typename?: 'attendance_config', TimeDeduction: any }> };

export type UpdateTimeDeductionMutationVariables = Exact<{
  TimeDeduction: Scalars['numeric']['input'];
  ID: Scalars['Int']['input'];
}>;


export type UpdateTimeDeductionMutation = { __typename?: 'mutation_root', update_attendance_config_by_pk?: { __typename?: 'attendance_config', TimeDeduction: any, ID: number } | null };

export type CommentsSubscriptionVariables = Exact<{
  OrderID: Scalars['Int']['input'];
}>;


export type CommentsSubscription = { __typename?: 'subscription_root', erp_Comments: Array<{ __typename?: 'erp_Comments', CommentID: number, Text: string, Timestamp: any, User: { __typename?: 'erp_Users', UserID: number, FirstName?: string | null, LastName?: string | null } }> };

export type InsertCommentMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  Text: Scalars['String']['input'];
  UserID: Scalars['Int']['input'];
}>;


export type InsertCommentMutation = { __typename?: 'mutation_root', insert_erp_Comments_one?: { __typename?: 'erp_Comments', CommentID: number, OrderID: number, Text: string, Timestamp: any, UserID: number } | null };

export type DeleteCommentMutationVariables = Exact<{
  CommentID: Scalars['Int']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'mutation_root', delete_erp_Comments_by_pk?: { __typename?: 'erp_Comments', CommentID: number } | null };

export type UpdateCommentMutationVariables = Exact<{
  CommentID: Scalars['Int']['input'];
  Text: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'mutation_root', update_erp_Comments_by_pk?: { __typename?: 'erp_Comments', OrderID: number, Text: string, Timestamp: any, UserID: number, CommentID: number } | null };

export type GetNotificationsSubscriptionVariables = Exact<{
  _eq: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNotificationsSubscription = { __typename?: 'subscription_root', erp_Notifications: Array<{ __typename?: 'erp_Notifications', ID: number, Viewed: boolean, Comment: { __typename?: 'erp_Comments', CommentID: number, Text: string, Timestamp: any, User: { __typename?: 'erp_Users', UserID: number, FirstName?: string | null, LastName?: string | null } }, Order?: { __typename?: 'erp_Orders', OrderID: number, City?: string | null, Entity?: string | null } | null }> };

export type UpdateViewedMutationVariables = Exact<{
  ID: Scalars['Int']['input'];
  Viewed: Scalars['Boolean']['input'];
}>;


export type UpdateViewedMutation = { __typename?: 'mutation_root', update_erp_Notifications_by_pk?: { __typename?: 'erp_Notifications', ID: number, Viewed: boolean } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'query_root', erp_Users: Array<{ __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null, UserID: number, AccessLevelID?: number | null }> };

export type GetOrderPaymentsQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetOrderPaymentsQuery = { __typename?: 'query_root', erp_PaymentHistory: Array<{ __typename?: 'erp_PaymentHistory', Date: any, ID: number, PaidAmount: any }> };

export type InsertNotificationMutationVariables = Exact<{
  CommentID: Scalars['Int']['input'];
  MentionedUser: Scalars['Int']['input'];
  OrderID: Scalars['Int']['input'];
}>;


export type InsertNotificationMutation = { __typename?: 'mutation_root', insert_erp_Notifications?: { __typename?: 'erp_Notifications_mutation_response', returning: Array<{ __typename?: 'erp_Notifications', MentionedUser?: number | null, ID: number }> } | null };

export type InsertDocumentsArrayMutationVariables = Exact<{
  objects: Array<Erp_Docs_Insert_Input> | Erp_Docs_Insert_Input;
}>;


export type InsertDocumentsArrayMutation = { __typename?: 'mutation_root', insert_erp_Docs?: { __typename?: 'erp_Docs_mutation_response', returning: Array<{ __typename?: 'erp_Docs', ID: number }> } | null };

export type InsertPaymentMutationVariables = Exact<{
  PaidAmount: Scalars['numeric']['input'];
  Date: Scalars['timestamp']['input'];
  OrderID: Scalars['Int']['input'];
}>;


export type InsertPaymentMutation = { __typename?: 'mutation_root', insert_erp_PaymentHistory_one?: { __typename?: 'erp_PaymentHistory', ID: number, OrderID: number } | null };

export type DeletePaymentMutationVariables = Exact<{
  ID: Scalars['Int']['input'];
}>;


export type DeletePaymentMutation = { __typename?: 'mutation_root', delete_erp_PaymentHistory_by_pk?: { __typename?: 'erp_PaymentHistory', ID: number } | null };

export type DeleteOrderMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
}>;


export type DeleteOrderMutation = { __typename?: 'mutation_root', delete_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number } | null };

export type InsertOrderItemMutationVariables = Exact<{
  name: Scalars['String']['input'];
  orderID: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  fullName: Scalars['String']['input'];
}>;


export type InsertOrderItemMutation = { __typename?: 'mutation_root', insert_erp_OrderItems_one?: { __typename?: 'erp_OrderItems', OrderItemID: number, OrderID: number } | null };

export type DeleteOrderItemByPkMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteOrderItemByPkMutation = { __typename?: 'mutation_root', delete_erp_OrderItems_by_pk?: { __typename?: 'erp_OrderItems', OrderItemID: number } | null };

export type UpdateOrderItemByPkMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  FullName: Scalars['String']['input'];
  Name: Scalars['String']['input'];
  Quantity: Scalars['Int']['input'];
}>;


export type UpdateOrderItemByPkMutation = { __typename?: 'mutation_root', update_erp_OrderItems_by_pk?: { __typename?: 'erp_OrderItems', Name: string, FullName?: string | null, OrderItemID: number, Quantity: number } | null };

export type MoveOrderToPriorityMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  AcceptanceDate: Scalars['timestamp']['input'];
}>;


export type MoveOrderToPriorityMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, OrderStatusID: number } | null };

export type MoveOrderToArchiveMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  ActualShippingDate: Scalars['timestamp']['input'];
  OrderStatusID: Scalars['Int']['input'];
}>;


export type MoveOrderToArchiveMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, OrderStatusID: number } | null };

export type UpdateNeedAttentionMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  NeedAttention: Scalars['String']['input'];
}>;


export type UpdateNeedAttentionMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, NeedAttention?: string | null } | null };

export type UpdateAwaitingDispatchMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  AwaitingDispatch: Scalars['Boolean']['input'];
}>;


export type UpdateAwaitingDispatchMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, AwaitingDispatch: boolean } | null };

export type UpdateOrderInfoMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  fields?: InputMaybe<Erp_Orders_Set_Input>;
}>;


export type UpdateOrderInfoMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, Entity?: string | null, City?: string | null, CreatingDate: any } | null };

export type GetOrdersByStatusQueryVariables = Exact<{
  ShippingDate?: InputMaybe<Order_By>;
  orderStatus: Scalars['Int']['input'];
}>;


export type GetOrdersByStatusQuery = { __typename?: 'query_root', erp_Orders: Array<{ __typename?: 'erp_Orders', OrderID: number, Entity?: string | null, InvoiceNumber?: string | null, City?: string | null, ShippingDate?: any | null, ActualShippingDate?: any | null, AcceptanceDate?: any | null, PaidAmount?: any | null, TotalAmount?: any | null, AwaitingDispatch: boolean, NeedAttention?: string | null, CreatingDate: any, ManagerID?: number | null, OrderStatusID: number, OrderStatus: { __typename?: 'erp_OrderStatus', Name: string, ID: number }, OrderItems: Array<{ __typename?: 'erp_OrderItems', Quantity: number, OrderItemID: number, Name: string, OrderID: number }>, User?: { __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null } | null, PaymentHistories: Array<{ __typename?: 'erp_PaymentHistory', ID: number, PaidAmount: any, Date: any }> }> };

export type GetOrdersArchivedBySearchKeywordQueryVariables = Exact<{
  keyword: Scalars['String']['input'];
  OrderStatus: Scalars['Int']['input'];
}>;


export type GetOrdersArchivedBySearchKeywordQuery = { __typename?: 'query_root', erp_Orders: Array<{ __typename?: 'erp_Orders', OrderID: number, Entity?: string | null, InvoiceNumber?: string | null, City?: string | null, ShippingDate?: any | null, ActualShippingDate?: any | null, AcceptanceDate?: any | null, PaidAmount?: any | null, TotalAmount?: any | null, AwaitingDispatch: boolean, NeedAttention?: string | null, CreatingDate: any, ManagerID?: number | null, OrderStatusID: number, OrderStatus: { __typename?: 'erp_OrderStatus', Name: string, ID: number }, OrderItems: Array<{ __typename?: 'erp_OrderItems', Quantity: number, OrderItemID: number, Name: string, OrderID: number }>, User?: { __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null } | null, PaymentHistories: Array<{ __typename?: 'erp_PaymentHistory', ID: number, PaidAmount: any, Date: any }> }> };

export type GetOrdersArchivedByIntervalQueryVariables = Exact<{
  _lte: Scalars['timestamp']['input'];
  _gte: Scalars['timestamp']['input'];
}>;


export type GetOrdersArchivedByIntervalQuery = { __typename?: 'query_root', erp_Orders: Array<{ __typename?: 'erp_Orders', OrderID: number, Entity?: string | null, InvoiceNumber?: string | null, City?: string | null, ShippingDate?: any | null, ActualShippingDate?: any | null, AcceptanceDate?: any | null, PaidAmount?: any | null, TotalAmount?: any | null, AwaitingDispatch: boolean, NeedAttention?: string | null, CreatingDate: any, ManagerID?: number | null, OrderStatusID: number, OrderStatus: { __typename?: 'erp_OrderStatus', Name: string, ID: number }, OrderItems: Array<{ __typename?: 'erp_OrderItems', Quantity: number, OrderItemID: number, Name: string, OrderID: number }>, User?: { __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null } | null, PaymentHistories: Array<{ __typename?: 'erp_PaymentHistory', ID: number, PaidAmount: any, Date: any }> }> };

export type GetManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetManagersQuery = { __typename?: 'query_root', erp_Users: Array<{ __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null, UserID: number, AccessLevelID?: number | null }> };

export type GetOrderByPkQueryVariables = Exact<{
  OrderID: Scalars['Int']['input'];
}>;


export type GetOrderByPkQuery = { __typename?: 'query_root', erp_Orders: Array<{ __typename?: 'erp_Orders', NeedAttention?: string | null, AwaitingDispatch: boolean, OrderStatusID: number, ActualShippingDate?: any | null, AcceptanceDate?: any | null, ShippingDate?: any | null, CreatingDate: any, OrderID: number, ManagerID?: number | null, City?: string | null, Comment?: string | null, Entity?: string | null, InvoiceNumber?: string | null, OrderNumber?: string | null, PaidAmount?: any | null, TotalAmount?: any | null, User?: { __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null, UserID: number } | null, OrderItems: Array<{ __typename?: 'erp_OrderItems', Name: string, FullName?: string | null, OrderItemID: number, Quantity: number }>, Docs: Array<{ __typename?: 'erp_Docs', ID: number, Key: string, FileName?: string | null, Size?: number | null, UploadingDate?: any | null }>, PaymentHistories: Array<{ __typename?: 'erp_PaymentHistory', ID: number, PaidAmount: any, Date: any }> }> };

export type InsertOrderMutationVariables = Exact<{
  orderStatusID: Scalars['Int']['input'];
}>;


export type InsertOrderMutation = { __typename?: 'mutation_root', insert_erp_Orders?: { __typename?: 'erp_Orders_mutation_response', returning: Array<{ __typename?: 'erp_Orders', OrderID: number }> } | null };

export type OrderFragment = { __typename?: 'erp_Orders', OrderID: number, Entity?: string | null, InvoiceNumber?: string | null, City?: string | null, ShippingDate?: any | null, ActualShippingDate?: any | null, AcceptanceDate?: any | null, PaidAmount?: any | null, TotalAmount?: any | null, AwaitingDispatch: boolean, NeedAttention?: string | null, CreatingDate: any, ManagerID?: number | null, OrderStatusID: number, OrderStatus: { __typename?: 'erp_OrderStatus', Name: string, ID: number }, OrderItems: Array<{ __typename?: 'erp_OrderItems', Quantity: number, OrderItemID: number, Name: string, OrderID: number }>, User?: { __typename?: 'erp_Users', FirstName?: string | null, LastName?: string | null } | null, PaymentHistories: Array<{ __typename?: 'erp_PaymentHistory', ID: number, PaidAmount: any, Date: any }> };

export type GetReclamationOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReclamationOrdersQuery = { __typename?: 'query_root', erp_Orders: Array<{ __typename?: 'erp_Orders', AwaitingDispatch: boolean, NeedAttention?: string | null, OrderID: number, Entity?: string | null, City?: string | null, OrderStatusID: number, OrderItems: Array<{ __typename?: 'erp_OrderItems', OrderItemID: number, Name: string }> }> };

export type UpdateOrderStatusMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  OrderStatusID: Scalars['Int']['input'];
}>;


export type UpdateOrderStatusMutation = { __typename?: 'mutation_root', update_erp_Orders_by_pk?: { __typename?: 'erp_Orders', OrderID: number, OrderStatusID: number } | null };

export type GetDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDetailsQuery = { __typename?: 'query_root', metal_pdo_details: Array<{ __typename?: 'metal_pdo_details', id: number, name: string, detail_materials: Array<{ __typename?: 'metal_pdo_detail_materials', cost?: any | null, material: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } }> }> };

export type GetDetailByPkQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetDetailByPkQuery = { __typename?: 'query_root', metal_pdo_details_by_pk?: { __typename?: 'metal_pdo_details', id: number, name: string, detail_materials: Array<{ __typename?: 'metal_pdo_detail_materials', cost?: any | null, material: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } }> } | null };

export type InsertDetailMutationVariables = Exact<{
  object: Metal_Pdo_Details_Insert_Input;
}>;


export type InsertDetailMutation = { __typename?: 'mutation_root', insert_metal_pdo_details_one?: { __typename?: 'metal_pdo_details', id: number, name: string } | null };

export type UpdateDetailMutationVariables = Exact<{
  _set: Metal_Pdo_Details_Set_Input;
  id: Scalars['Int']['input'];
}>;


export type UpdateDetailMutation = { __typename?: 'mutation_root', update_metal_pdo_details_by_pk?: { __typename?: 'metal_pdo_details', id: number } | null };

export type UpdateDetailMaterialCostMutationVariables = Exact<{
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
  cost: Scalars['numeric']['input'];
}>;


export type UpdateDetailMaterialCostMutation = { __typename?: 'mutation_root', update_metal_pdo_detail_materials_by_pk?: { __typename?: 'metal_pdo_detail_materials', cost?: any | null } | null };

export type DeleteDetailMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteDetailMutation = { __typename?: 'mutation_root', delete_metal_pdo_details_by_pk?: { __typename?: 'metal_pdo_details', id: number } | null };

export type GetDetailMaterialsQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetDetailMaterialsQuery = { __typename?: 'query_root', metal_pdo_detail_materials: Array<{ __typename?: 'metal_pdo_detail_materials', material: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } }> };

export type GetDetailsMadeFromThatMaterialQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetDetailsMadeFromThatMaterialQuery = { __typename?: 'query_root', metal_pdo_detail_materials: Array<{ __typename?: 'metal_pdo_detail_materials', detail: { __typename?: 'metal_pdo_details', id: number, name: string } }> };

export type InsertDetailMaterialsMutationVariables = Exact<{
  objects: Array<Metal_Pdo_Detail_Materials_Insert_Input> | Metal_Pdo_Detail_Materials_Insert_Input;
}>;


export type InsertDetailMaterialsMutation = { __typename?: 'mutation_root', insert_metal_pdo_detail_materials?: { __typename?: 'metal_pdo_detail_materials_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'metal_pdo_detail_materials', detail_id: number, material_id: number }> } | null };

export type MaterialFragmentFragment = { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null };

export type GetMaterialsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMaterialsQuery = { __typename?: 'query_root', metal_pdo_materials: Array<{ __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null }> };

export type GetMaterialByPkQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMaterialByPkQuery = { __typename?: 'query_root', metal_pdo_materials_by_pk?: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } | null };

export type GetCirclePossibleAlloysQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetCirclePossibleAlloysQuery = { __typename?: 'query_root', metal_pdo_materials: Array<{ __typename?: 'metal_pdo_materials', shape_data?: any | null }> };

export type InsertMaterialMutationVariables = Exact<{
  object: Metal_Pdo_Materials_Insert_Input;
}>;


export type InsertMaterialMutation = { __typename?: 'mutation_root', insert_metal_pdo_materials_one?: { __typename?: 'metal_pdo_materials', id: number } | null };

export type UpdateMaterialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  _set: Metal_Pdo_Materials_Set_Input;
}>;


export type UpdateMaterialMutation = { __typename?: 'mutation_root', update_metal_pdo_materials_by_pk?: { __typename?: 'metal_pdo_materials', id: number } | null };

export type DeleteMaterialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteMaterialMutation = { __typename?: 'mutation_root', delete_metal_pdo_materials_by_pk?: { __typename?: 'metal_pdo_materials', id: number } | null };

export type InsertMaterialSupplyMutationVariables = Exact<{
  object: Metal_Pdo_Supplies_Insert_Input;
}>;


export type InsertMaterialSupplyMutation = { __typename?: 'mutation_root', insert_metal_pdo_supplies_one?: { __typename?: 'metal_pdo_supplies', id: number } | null };

export type GetSuppliesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSuppliesQuery = { __typename?: 'query_root', metal_pdo_supplies: Array<{ __typename?: 'metal_pdo_supplies', id: number, material_id?: number | null, qty: any, supplied_at: any, supplier_name: string, material?: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } | null }> };

export type DeleteSupplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSupplyMutation = { __typename?: 'mutation_root', delete_metal_pdo_supplies_by_pk?: { __typename?: 'metal_pdo_supplies', id: number } | null };

export type InsertMaterialWriteoffMutationVariables = Exact<{
  objects: Array<Metal_Pdo_Writeoffs_Insert_Input> | Metal_Pdo_Writeoffs_Insert_Input;
}>;


export type InsertMaterialWriteoffMutation = { __typename?: 'mutation_root', insert_metal_pdo_writeoffs?: { __typename?: 'metal_pdo_writeoffs_mutation_response', affected_rows: number } | null };

export type GetWrietOffsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWrietOffsQuery = { __typename?: 'query_root', metal_pdo_writeoffs: Array<{ __typename?: 'metal_pdo_writeoffs', id: number, date: any, qty: any, type: number, type_data: any, reason: number, material: { __typename?: 'metal_pdo_materials', id: number, unit: number, shape: number, shape_data?: any | null } }> };

export type DeleteWriteOffMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteWriteOffMutation = { __typename?: 'mutation_root', delete_metal_pdo_writeoffs_by_pk?: { __typename?: 'metal_pdo_writeoffs', id: number } | null };

export const OrderFragmentDoc = gql`
    fragment Order on erp_Orders {
  OrderID
  Entity
  InvoiceNumber
  City
  ShippingDate
  ActualShippingDate
  AcceptanceDate
  PaidAmount
  TotalAmount
  AwaitingDispatch
  NeedAttention
  CreatingDate
  ManagerID
  OrderStatusID
  OrderStatus {
    Name
    ID
  }
  OrderItems(order_by: {OrderItemID: asc}) {
    Quantity
    OrderItemID
    Name
    OrderID
  }
  User {
    FirstName
    LastName
  }
  PaymentHistories(limit: 1, order_by: {PaidAmount: desc}) {
    ID
    PaidAmount
    Date
  }
}
    `;
export const MaterialFragmentFragmentDoc = gql`
    fragment MaterialFragment on metal_pdo_materials {
  id
  unit
  shape
  shape_data
}
    `;
export const GetEmployeeListDocument = gql`
    query GetEmployeeList($gte: timestamp!, $lte: timestamp!) {
  attendance_users_aggregate(order_by: {lastname: asc}) {
    nodes {
      id
      card
      firstname
      lastname
      intervals(where: {ent: {_gte: $gte, _lte: $lte}}) {
        ent
        ext
        card
      }
    }
  }
  attendance_config {
    TimeDeduction
  }
}
    `;

/**
 * __useGetEmployeeListQuery__
 *
 * To run a query within a React component, call `useGetEmployeeListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeListQuery({
 *   variables: {
 *      gte: // value for 'gte'
 *      lte: // value for 'lte'
 *   },
 * });
 */
export function useGetEmployeeListQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeListQuery, GetEmployeeListQueryVariables> & ({ variables: GetEmployeeListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeListQuery, GetEmployeeListQueryVariables>(GetEmployeeListDocument, options);
      }
export function useGetEmployeeListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeListQuery, GetEmployeeListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeListQuery, GetEmployeeListQueryVariables>(GetEmployeeListDocument, options);
        }
export function useGetEmployeeListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeListQuery, GetEmployeeListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeListQuery, GetEmployeeListQueryVariables>(GetEmployeeListDocument, options);
        }
export type GetEmployeeListQueryHookResult = ReturnType<typeof useGetEmployeeListQuery>;
export type GetEmployeeListLazyQueryHookResult = ReturnType<typeof useGetEmployeeListLazyQuery>;
export type GetEmployeeListSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeListSuspenseQuery>;
export type GetEmployeeListQueryResult = Apollo.QueryResult<GetEmployeeListQuery, GetEmployeeListQueryVariables>;
export const UpdateTimeDeductionDocument = gql`
    mutation UpdateTimeDeduction($TimeDeduction: numeric!, $ID: Int!) {
  update_attendance_config_by_pk(
    pk_columns: {ID: $ID}
    _set: {TimeDeduction: $TimeDeduction}
  ) {
    TimeDeduction
    ID
  }
}
    `;
export type UpdateTimeDeductionMutationFn = Apollo.MutationFunction<UpdateTimeDeductionMutation, UpdateTimeDeductionMutationVariables>;

/**
 * __useUpdateTimeDeductionMutation__
 *
 * To run a mutation, you first call `useUpdateTimeDeductionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTimeDeductionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTimeDeductionMutation, { data, loading, error }] = useUpdateTimeDeductionMutation({
 *   variables: {
 *      TimeDeduction: // value for 'TimeDeduction'
 *      ID: // value for 'ID'
 *   },
 * });
 */
export function useUpdateTimeDeductionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTimeDeductionMutation, UpdateTimeDeductionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTimeDeductionMutation, UpdateTimeDeductionMutationVariables>(UpdateTimeDeductionDocument, options);
      }
export type UpdateTimeDeductionMutationHookResult = ReturnType<typeof useUpdateTimeDeductionMutation>;
export type UpdateTimeDeductionMutationResult = Apollo.MutationResult<UpdateTimeDeductionMutation>;
export type UpdateTimeDeductionMutationOptions = Apollo.BaseMutationOptions<UpdateTimeDeductionMutation, UpdateTimeDeductionMutationVariables>;
export const CommentsDocument = gql`
    subscription Comments($OrderID: Int!) {
  erp_Comments(where: {OrderID: {_eq: $OrderID}}, order_by: {CommentID: desc}) {
    CommentID
    Text
    Timestamp
    User {
      UserID
      FirstName
      LastName
    }
  }
}
    `;

/**
 * __useCommentsSubscription__
 *
 * To run a query within a React component, call `useCommentsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommentsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsSubscription({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *   },
 * });
 */
export function useCommentsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CommentsSubscription, CommentsSubscriptionVariables> & ({ variables: CommentsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CommentsSubscription, CommentsSubscriptionVariables>(CommentsDocument, options);
      }
export type CommentsSubscriptionHookResult = ReturnType<typeof useCommentsSubscription>;
export type CommentsSubscriptionResult = Apollo.SubscriptionResult<CommentsSubscription>;
export const InsertCommentDocument = gql`
    mutation InsertComment($OrderID: Int!, $Text: String!, $UserID: Int!) {
  insert_erp_Comments_one(
    object: {OrderID: $OrderID, Text: $Text, UserID: $UserID}
  ) {
    CommentID
    OrderID
    Text
    Timestamp
    UserID
  }
}
    `;
export type InsertCommentMutationFn = Apollo.MutationFunction<InsertCommentMutation, InsertCommentMutationVariables>;

/**
 * __useInsertCommentMutation__
 *
 * To run a mutation, you first call `useInsertCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertCommentMutation, { data, loading, error }] = useInsertCommentMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      Text: // value for 'Text'
 *      UserID: // value for 'UserID'
 *   },
 * });
 */
export function useInsertCommentMutation(baseOptions?: Apollo.MutationHookOptions<InsertCommentMutation, InsertCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertCommentMutation, InsertCommentMutationVariables>(InsertCommentDocument, options);
      }
export type InsertCommentMutationHookResult = ReturnType<typeof useInsertCommentMutation>;
export type InsertCommentMutationResult = Apollo.MutationResult<InsertCommentMutation>;
export type InsertCommentMutationOptions = Apollo.BaseMutationOptions<InsertCommentMutation, InsertCommentMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($CommentID: Int!) {
  delete_erp_Comments_by_pk(CommentID: $CommentID) {
    CommentID
  }
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      CommentID: // value for 'CommentID'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const UpdateCommentDocument = gql`
    mutation UpdateComment($CommentID: Int!, $Text: String!) {
  update_erp_Comments_by_pk(
    pk_columns: {CommentID: $CommentID}
    _set: {Text: $Text}
  ) {
    OrderID
    Text
    Timestamp
    UserID
    CommentID
  }
}
    `;
export type UpdateCommentMutationFn = Apollo.MutationFunction<UpdateCommentMutation, UpdateCommentMutationVariables>;

/**
 * __useUpdateCommentMutation__
 *
 * To run a mutation, you first call `useUpdateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCommentMutation, { data, loading, error }] = useUpdateCommentMutation({
 *   variables: {
 *      CommentID: // value for 'CommentID'
 *      Text: // value for 'Text'
 *   },
 * });
 */
export function useUpdateCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCommentMutation, UpdateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument, options);
      }
export type UpdateCommentMutationHookResult = ReturnType<typeof useUpdateCommentMutation>;
export type UpdateCommentMutationResult = Apollo.MutationResult<UpdateCommentMutation>;
export type UpdateCommentMutationOptions = Apollo.BaseMutationOptions<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const GetNotificationsDocument = gql`
    subscription GetNotifications($_eq: Int!, $limit: Int) {
  erp_Notifications(
    where: {MentionedUser: {_eq: $_eq}}
    limit: $limit
    order_by: {ID: desc}
  ) {
    ID
    Viewed
    Comment {
      CommentID
      Text
      Timestamp
      User {
        UserID
        FirstName
        LastName
      }
    }
    Order {
      OrderID
      City
      Entity
    }
  }
}
    `;

/**
 * __useGetNotificationsSubscription__
 *
 * To run a query within a React component, call `useGetNotificationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsSubscription({
 *   variables: {
 *      _eq: // value for '_eq'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetNotificationsSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetNotificationsSubscription, GetNotificationsSubscriptionVariables> & ({ variables: GetNotificationsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetNotificationsSubscription, GetNotificationsSubscriptionVariables>(GetNotificationsDocument, options);
      }
export type GetNotificationsSubscriptionHookResult = ReturnType<typeof useGetNotificationsSubscription>;
export type GetNotificationsSubscriptionResult = Apollo.SubscriptionResult<GetNotificationsSubscription>;
export const UpdateViewedDocument = gql`
    mutation UpdateViewed($ID: Int!, $Viewed: Boolean!) {
  update_erp_Notifications_by_pk(pk_columns: {ID: $ID}, _set: {Viewed: $Viewed}) {
    ID
    Viewed
  }
}
    `;
export type UpdateViewedMutationFn = Apollo.MutationFunction<UpdateViewedMutation, UpdateViewedMutationVariables>;

/**
 * __useUpdateViewedMutation__
 *
 * To run a mutation, you first call `useUpdateViewedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateViewedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateViewedMutation, { data, loading, error }] = useUpdateViewedMutation({
 *   variables: {
 *      ID: // value for 'ID'
 *      Viewed: // value for 'Viewed'
 *   },
 * });
 */
export function useUpdateViewedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateViewedMutation, UpdateViewedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateViewedMutation, UpdateViewedMutationVariables>(UpdateViewedDocument, options);
      }
export type UpdateViewedMutationHookResult = ReturnType<typeof useUpdateViewedMutation>;
export type UpdateViewedMutationResult = Apollo.MutationResult<UpdateViewedMutation>;
export type UpdateViewedMutationOptions = Apollo.BaseMutationOptions<UpdateViewedMutation, UpdateViewedMutationVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  erp_Users {
    FirstName
    LastName
    UserID
    AccessLevelID
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetOrderPaymentsDocument = gql`
    query GetOrderPayments($_eq: Int!) {
  erp_PaymentHistory(where: {OrderID: {_eq: $_eq}}, order_by: {Date: asc}) {
    Date
    ID
    PaidAmount
  }
}
    `;

/**
 * __useGetOrderPaymentsQuery__
 *
 * To run a query within a React component, call `useGetOrderPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderPaymentsQuery({
 *   variables: {
 *      _eq: // value for '_eq'
 *   },
 * });
 */
export function useGetOrderPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables> & ({ variables: GetOrderPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>(GetOrderPaymentsDocument, options);
      }
export function useGetOrderPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>(GetOrderPaymentsDocument, options);
        }
export function useGetOrderPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>(GetOrderPaymentsDocument, options);
        }
export type GetOrderPaymentsQueryHookResult = ReturnType<typeof useGetOrderPaymentsQuery>;
export type GetOrderPaymentsLazyQueryHookResult = ReturnType<typeof useGetOrderPaymentsLazyQuery>;
export type GetOrderPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetOrderPaymentsSuspenseQuery>;
export type GetOrderPaymentsQueryResult = Apollo.QueryResult<GetOrderPaymentsQuery, GetOrderPaymentsQueryVariables>;
export const InsertNotificationDocument = gql`
    mutation InsertNotification($CommentID: Int!, $MentionedUser: Int!, $OrderID: Int!) {
  insert_erp_Notifications(
    objects: {CommentID: $CommentID, MentionedUser: $MentionedUser, OrderID: $OrderID}
  ) {
    returning {
      MentionedUser
      ID
    }
  }
}
    `;
export type InsertNotificationMutationFn = Apollo.MutationFunction<InsertNotificationMutation, InsertNotificationMutationVariables>;

/**
 * __useInsertNotificationMutation__
 *
 * To run a mutation, you first call `useInsertNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertNotificationMutation, { data, loading, error }] = useInsertNotificationMutation({
 *   variables: {
 *      CommentID: // value for 'CommentID'
 *      MentionedUser: // value for 'MentionedUser'
 *      OrderID: // value for 'OrderID'
 *   },
 * });
 */
export function useInsertNotificationMutation(baseOptions?: Apollo.MutationHookOptions<InsertNotificationMutation, InsertNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertNotificationMutation, InsertNotificationMutationVariables>(InsertNotificationDocument, options);
      }
export type InsertNotificationMutationHookResult = ReturnType<typeof useInsertNotificationMutation>;
export type InsertNotificationMutationResult = Apollo.MutationResult<InsertNotificationMutation>;
export type InsertNotificationMutationOptions = Apollo.BaseMutationOptions<InsertNotificationMutation, InsertNotificationMutationVariables>;
export const InsertDocumentsArrayDocument = gql`
    mutation InsertDocumentsArray($objects: [erp_Docs_insert_input!]!) {
  insert_erp_Docs(objects: $objects) {
    returning {
      ID
    }
  }
}
    `;
export type InsertDocumentsArrayMutationFn = Apollo.MutationFunction<InsertDocumentsArrayMutation, InsertDocumentsArrayMutationVariables>;

/**
 * __useInsertDocumentsArrayMutation__
 *
 * To run a mutation, you first call `useInsertDocumentsArrayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertDocumentsArrayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertDocumentsArrayMutation, { data, loading, error }] = useInsertDocumentsArrayMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useInsertDocumentsArrayMutation(baseOptions?: Apollo.MutationHookOptions<InsertDocumentsArrayMutation, InsertDocumentsArrayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertDocumentsArrayMutation, InsertDocumentsArrayMutationVariables>(InsertDocumentsArrayDocument, options);
      }
export type InsertDocumentsArrayMutationHookResult = ReturnType<typeof useInsertDocumentsArrayMutation>;
export type InsertDocumentsArrayMutationResult = Apollo.MutationResult<InsertDocumentsArrayMutation>;
export type InsertDocumentsArrayMutationOptions = Apollo.BaseMutationOptions<InsertDocumentsArrayMutation, InsertDocumentsArrayMutationVariables>;
export const InsertPaymentDocument = gql`
    mutation InsertPayment($PaidAmount: numeric!, $Date: timestamp!, $OrderID: Int!) {
  insert_erp_PaymentHistory_one(
    object: {PaidAmount: $PaidAmount, OrderID: $OrderID, Date: $Date}
  ) {
    ID
    OrderID
  }
}
    `;
export type InsertPaymentMutationFn = Apollo.MutationFunction<InsertPaymentMutation, InsertPaymentMutationVariables>;

/**
 * __useInsertPaymentMutation__
 *
 * To run a mutation, you first call `useInsertPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertPaymentMutation, { data, loading, error }] = useInsertPaymentMutation({
 *   variables: {
 *      PaidAmount: // value for 'PaidAmount'
 *      Date: // value for 'Date'
 *      OrderID: // value for 'OrderID'
 *   },
 * });
 */
export function useInsertPaymentMutation(baseOptions?: Apollo.MutationHookOptions<InsertPaymentMutation, InsertPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertPaymentMutation, InsertPaymentMutationVariables>(InsertPaymentDocument, options);
      }
export type InsertPaymentMutationHookResult = ReturnType<typeof useInsertPaymentMutation>;
export type InsertPaymentMutationResult = Apollo.MutationResult<InsertPaymentMutation>;
export type InsertPaymentMutationOptions = Apollo.BaseMutationOptions<InsertPaymentMutation, InsertPaymentMutationVariables>;
export const DeletePaymentDocument = gql`
    mutation DeletePayment($ID: Int!) {
  delete_erp_PaymentHistory_by_pk(ID: $ID) {
    ID
  }
}
    `;
export type DeletePaymentMutationFn = Apollo.MutationFunction<DeletePaymentMutation, DeletePaymentMutationVariables>;

/**
 * __useDeletePaymentMutation__
 *
 * To run a mutation, you first call `useDeletePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePaymentMutation, { data, loading, error }] = useDeletePaymentMutation({
 *   variables: {
 *      ID: // value for 'ID'
 *   },
 * });
 */
export function useDeletePaymentMutation(baseOptions?: Apollo.MutationHookOptions<DeletePaymentMutation, DeletePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePaymentMutation, DeletePaymentMutationVariables>(DeletePaymentDocument, options);
      }
export type DeletePaymentMutationHookResult = ReturnType<typeof useDeletePaymentMutation>;
export type DeletePaymentMutationResult = Apollo.MutationResult<DeletePaymentMutation>;
export type DeletePaymentMutationOptions = Apollo.BaseMutationOptions<DeletePaymentMutation, DeletePaymentMutationVariables>;
export const DeleteOrderDocument = gql`
    mutation DeleteOrder($OrderID: Int!) {
  delete_erp_Orders_by_pk(OrderID: $OrderID) {
    OrderID
  }
}
    `;
export type DeleteOrderMutationFn = Apollo.MutationFunction<DeleteOrderMutation, DeleteOrderMutationVariables>;

/**
 * __useDeleteOrderMutation__
 *
 * To run a mutation, you first call `useDeleteOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderMutation, { data, loading, error }] = useDeleteOrderMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *   },
 * });
 */
export function useDeleteOrderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderMutation, DeleteOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrderMutation, DeleteOrderMutationVariables>(DeleteOrderDocument, options);
      }
export type DeleteOrderMutationHookResult = ReturnType<typeof useDeleteOrderMutation>;
export type DeleteOrderMutationResult = Apollo.MutationResult<DeleteOrderMutation>;
export type DeleteOrderMutationOptions = Apollo.BaseMutationOptions<DeleteOrderMutation, DeleteOrderMutationVariables>;
export const InsertOrderItemDocument = gql`
    mutation InsertOrderItem($name: String!, $orderID: Int!, $quantity: Int!, $fullName: String!) {
  insert_erp_OrderItems_one(
    object: {OrderID: $orderID, Name: $name, FullName: $fullName, Quantity: $quantity}
  ) {
    OrderItemID
    OrderID
  }
}
    `;
export type InsertOrderItemMutationFn = Apollo.MutationFunction<InsertOrderItemMutation, InsertOrderItemMutationVariables>;

/**
 * __useInsertOrderItemMutation__
 *
 * To run a mutation, you first call `useInsertOrderItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertOrderItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertOrderItemMutation, { data, loading, error }] = useInsertOrderItemMutation({
 *   variables: {
 *      name: // value for 'name'
 *      orderID: // value for 'orderID'
 *      quantity: // value for 'quantity'
 *      fullName: // value for 'fullName'
 *   },
 * });
 */
export function useInsertOrderItemMutation(baseOptions?: Apollo.MutationHookOptions<InsertOrderItemMutation, InsertOrderItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertOrderItemMutation, InsertOrderItemMutationVariables>(InsertOrderItemDocument, options);
      }
export type InsertOrderItemMutationHookResult = ReturnType<typeof useInsertOrderItemMutation>;
export type InsertOrderItemMutationResult = Apollo.MutationResult<InsertOrderItemMutation>;
export type InsertOrderItemMutationOptions = Apollo.BaseMutationOptions<InsertOrderItemMutation, InsertOrderItemMutationVariables>;
export const DeleteOrderItemByPkDocument = gql`
    mutation DeleteOrderItemByPk($id: Int!) {
  delete_erp_OrderItems_by_pk(OrderItemID: $id) {
    OrderItemID
  }
}
    `;
export type DeleteOrderItemByPkMutationFn = Apollo.MutationFunction<DeleteOrderItemByPkMutation, DeleteOrderItemByPkMutationVariables>;

/**
 * __useDeleteOrderItemByPkMutation__
 *
 * To run a mutation, you first call `useDeleteOrderItemByPkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderItemByPkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderItemByPkMutation, { data, loading, error }] = useDeleteOrderItemByPkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrderItemByPkMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderItemByPkMutation, DeleteOrderItemByPkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrderItemByPkMutation, DeleteOrderItemByPkMutationVariables>(DeleteOrderItemByPkDocument, options);
      }
export type DeleteOrderItemByPkMutationHookResult = ReturnType<typeof useDeleteOrderItemByPkMutation>;
export type DeleteOrderItemByPkMutationResult = Apollo.MutationResult<DeleteOrderItemByPkMutation>;
export type DeleteOrderItemByPkMutationOptions = Apollo.BaseMutationOptions<DeleteOrderItemByPkMutation, DeleteOrderItemByPkMutationVariables>;
export const UpdateOrderItemByPkDocument = gql`
    mutation UpdateOrderItemByPk($id: Int!, $FullName: String!, $Name: String!, $Quantity: Int!) {
  update_erp_OrderItems_by_pk(
    pk_columns: {OrderItemID: $id}
    _set: {FullName: $FullName, Name: $Name, Quantity: $Quantity}
  ) {
    Name
    FullName
    OrderItemID
    Quantity
  }
}
    `;
export type UpdateOrderItemByPkMutationFn = Apollo.MutationFunction<UpdateOrderItemByPkMutation, UpdateOrderItemByPkMutationVariables>;

/**
 * __useUpdateOrderItemByPkMutation__
 *
 * To run a mutation, you first call `useUpdateOrderItemByPkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderItemByPkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderItemByPkMutation, { data, loading, error }] = useUpdateOrderItemByPkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      FullName: // value for 'FullName'
 *      Name: // value for 'Name'
 *      Quantity: // value for 'Quantity'
 *   },
 * });
 */
export function useUpdateOrderItemByPkMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderItemByPkMutation, UpdateOrderItemByPkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderItemByPkMutation, UpdateOrderItemByPkMutationVariables>(UpdateOrderItemByPkDocument, options);
      }
export type UpdateOrderItemByPkMutationHookResult = ReturnType<typeof useUpdateOrderItemByPkMutation>;
export type UpdateOrderItemByPkMutationResult = Apollo.MutationResult<UpdateOrderItemByPkMutation>;
export type UpdateOrderItemByPkMutationOptions = Apollo.BaseMutationOptions<UpdateOrderItemByPkMutation, UpdateOrderItemByPkMutationVariables>;
export const MoveOrderToPriorityDocument = gql`
    mutation MoveOrderToPriority($OrderID: Int!, $AcceptanceDate: timestamp!) {
  update_erp_Orders_by_pk(
    pk_columns: {OrderID: $OrderID}
    _set: {OrderStatusID: 2, AcceptanceDate: $AcceptanceDate}
  ) {
    OrderID
    OrderStatusID
  }
}
    `;
export type MoveOrderToPriorityMutationFn = Apollo.MutationFunction<MoveOrderToPriorityMutation, MoveOrderToPriorityMutationVariables>;

/**
 * __useMoveOrderToPriorityMutation__
 *
 * To run a mutation, you first call `useMoveOrderToPriorityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveOrderToPriorityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveOrderToPriorityMutation, { data, loading, error }] = useMoveOrderToPriorityMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      AcceptanceDate: // value for 'AcceptanceDate'
 *   },
 * });
 */
export function useMoveOrderToPriorityMutation(baseOptions?: Apollo.MutationHookOptions<MoveOrderToPriorityMutation, MoveOrderToPriorityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveOrderToPriorityMutation, MoveOrderToPriorityMutationVariables>(MoveOrderToPriorityDocument, options);
      }
export type MoveOrderToPriorityMutationHookResult = ReturnType<typeof useMoveOrderToPriorityMutation>;
export type MoveOrderToPriorityMutationResult = Apollo.MutationResult<MoveOrderToPriorityMutation>;
export type MoveOrderToPriorityMutationOptions = Apollo.BaseMutationOptions<MoveOrderToPriorityMutation, MoveOrderToPriorityMutationVariables>;
export const MoveOrderToArchiveDocument = gql`
    mutation MoveOrderToArchive($OrderID: Int!, $ActualShippingDate: timestamp!, $OrderStatusID: Int!) {
  update_erp_Orders_by_pk(
    pk_columns: {OrderID: $OrderID}
    _set: {OrderStatusID: $OrderStatusID, AwaitingDispatch: false, ActualShippingDate: $ActualShippingDate}
  ) {
    OrderID
    OrderStatusID
  }
}
    `;
export type MoveOrderToArchiveMutationFn = Apollo.MutationFunction<MoveOrderToArchiveMutation, MoveOrderToArchiveMutationVariables>;

/**
 * __useMoveOrderToArchiveMutation__
 *
 * To run a mutation, you first call `useMoveOrderToArchiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveOrderToArchiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveOrderToArchiveMutation, { data, loading, error }] = useMoveOrderToArchiveMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      ActualShippingDate: // value for 'ActualShippingDate'
 *      OrderStatusID: // value for 'OrderStatusID'
 *   },
 * });
 */
export function useMoveOrderToArchiveMutation(baseOptions?: Apollo.MutationHookOptions<MoveOrderToArchiveMutation, MoveOrderToArchiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveOrderToArchiveMutation, MoveOrderToArchiveMutationVariables>(MoveOrderToArchiveDocument, options);
      }
export type MoveOrderToArchiveMutationHookResult = ReturnType<typeof useMoveOrderToArchiveMutation>;
export type MoveOrderToArchiveMutationResult = Apollo.MutationResult<MoveOrderToArchiveMutation>;
export type MoveOrderToArchiveMutationOptions = Apollo.BaseMutationOptions<MoveOrderToArchiveMutation, MoveOrderToArchiveMutationVariables>;
export const UpdateNeedAttentionDocument = gql`
    mutation UpdateNeedAttention($OrderID: Int!, $NeedAttention: String!) {
  update_erp_Orders_by_pk(
    pk_columns: {OrderID: $OrderID}
    _set: {NeedAttention: $NeedAttention}
  ) {
    OrderID
    NeedAttention
  }
}
    `;
export type UpdateNeedAttentionMutationFn = Apollo.MutationFunction<UpdateNeedAttentionMutation, UpdateNeedAttentionMutationVariables>;

/**
 * __useUpdateNeedAttentionMutation__
 *
 * To run a mutation, you first call `useUpdateNeedAttentionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNeedAttentionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNeedAttentionMutation, { data, loading, error }] = useUpdateNeedAttentionMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      NeedAttention: // value for 'NeedAttention'
 *   },
 * });
 */
export function useUpdateNeedAttentionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNeedAttentionMutation, UpdateNeedAttentionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNeedAttentionMutation, UpdateNeedAttentionMutationVariables>(UpdateNeedAttentionDocument, options);
      }
export type UpdateNeedAttentionMutationHookResult = ReturnType<typeof useUpdateNeedAttentionMutation>;
export type UpdateNeedAttentionMutationResult = Apollo.MutationResult<UpdateNeedAttentionMutation>;
export type UpdateNeedAttentionMutationOptions = Apollo.BaseMutationOptions<UpdateNeedAttentionMutation, UpdateNeedAttentionMutationVariables>;
export const UpdateAwaitingDispatchDocument = gql`
    mutation UpdateAwaitingDispatch($OrderID: Int!, $AwaitingDispatch: Boolean!) {
  update_erp_Orders_by_pk(
    pk_columns: {OrderID: $OrderID}
    _set: {AwaitingDispatch: $AwaitingDispatch}
  ) {
    OrderID
    AwaitingDispatch
  }
}
    `;
export type UpdateAwaitingDispatchMutationFn = Apollo.MutationFunction<UpdateAwaitingDispatchMutation, UpdateAwaitingDispatchMutationVariables>;

/**
 * __useUpdateAwaitingDispatchMutation__
 *
 * To run a mutation, you first call `useUpdateAwaitingDispatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAwaitingDispatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAwaitingDispatchMutation, { data, loading, error }] = useUpdateAwaitingDispatchMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      AwaitingDispatch: // value for 'AwaitingDispatch'
 *   },
 * });
 */
export function useUpdateAwaitingDispatchMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAwaitingDispatchMutation, UpdateAwaitingDispatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAwaitingDispatchMutation, UpdateAwaitingDispatchMutationVariables>(UpdateAwaitingDispatchDocument, options);
      }
export type UpdateAwaitingDispatchMutationHookResult = ReturnType<typeof useUpdateAwaitingDispatchMutation>;
export type UpdateAwaitingDispatchMutationResult = Apollo.MutationResult<UpdateAwaitingDispatchMutation>;
export type UpdateAwaitingDispatchMutationOptions = Apollo.BaseMutationOptions<UpdateAwaitingDispatchMutation, UpdateAwaitingDispatchMutationVariables>;
export const UpdateOrderInfoDocument = gql`
    mutation UpdateOrderInfo($OrderID: Int!, $fields: erp_Orders_set_input) {
  update_erp_Orders_by_pk(pk_columns: {OrderID: $OrderID}, _set: $fields) {
    OrderID
    Entity
    City
    CreatingDate
  }
}
    `;
export type UpdateOrderInfoMutationFn = Apollo.MutationFunction<UpdateOrderInfoMutation, UpdateOrderInfoMutationVariables>;

/**
 * __useUpdateOrderInfoMutation__
 *
 * To run a mutation, you first call `useUpdateOrderInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderInfoMutation, { data, loading, error }] = useUpdateOrderInfoMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      fields: // value for 'fields'
 *   },
 * });
 */
export function useUpdateOrderInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderInfoMutation, UpdateOrderInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderInfoMutation, UpdateOrderInfoMutationVariables>(UpdateOrderInfoDocument, options);
      }
export type UpdateOrderInfoMutationHookResult = ReturnType<typeof useUpdateOrderInfoMutation>;
export type UpdateOrderInfoMutationResult = Apollo.MutationResult<UpdateOrderInfoMutation>;
export type UpdateOrderInfoMutationOptions = Apollo.BaseMutationOptions<UpdateOrderInfoMutation, UpdateOrderInfoMutationVariables>;
export const GetOrdersByStatusDocument = gql`
    query getOrdersByStatus($ShippingDate: order_by = asc_nulls_first, $orderStatus: Int!) {
  erp_Orders(
    where: {OrderStatusID: {_eq: $orderStatus}}
    order_by: {ShippingDate: $ShippingDate}
  ) {
    ...Order
  }
}
    ${OrderFragmentDoc}`;

/**
 * __useGetOrdersByStatusQuery__
 *
 * To run a query within a React component, call `useGetOrdersByStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersByStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersByStatusQuery({
 *   variables: {
 *      ShippingDate: // value for 'ShippingDate'
 *      orderStatus: // value for 'orderStatus'
 *   },
 * });
 */
export function useGetOrdersByStatusQuery(baseOptions: Apollo.QueryHookOptions<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables> & ({ variables: GetOrdersByStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>(GetOrdersByStatusDocument, options);
      }
export function useGetOrdersByStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>(GetOrdersByStatusDocument, options);
        }
export function useGetOrdersByStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>(GetOrdersByStatusDocument, options);
        }
export type GetOrdersByStatusQueryHookResult = ReturnType<typeof useGetOrdersByStatusQuery>;
export type GetOrdersByStatusLazyQueryHookResult = ReturnType<typeof useGetOrdersByStatusLazyQuery>;
export type GetOrdersByStatusSuspenseQueryHookResult = ReturnType<typeof useGetOrdersByStatusSuspenseQuery>;
export type GetOrdersByStatusQueryResult = Apollo.QueryResult<GetOrdersByStatusQuery, GetOrdersByStatusQueryVariables>;
export const GetOrdersArchivedBySearchKeywordDocument = gql`
    query getOrdersArchivedBySearchKeyword($keyword: String!, $OrderStatus: Int!) {
  erp_Orders(
    order_by: {ActualShippingDate: desc_nulls_last}
    where: {_or: [{Entity: {_ilike: $keyword}}, {InvoiceNumber: {_ilike: $keyword, _is_null: false}}], OrderStatusID: {_eq: $OrderStatus}}
  ) {
    ...Order
  }
}
    ${OrderFragmentDoc}`;

/**
 * __useGetOrdersArchivedBySearchKeywordQuery__
 *
 * To run a query within a React component, call `useGetOrdersArchivedBySearchKeywordQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersArchivedBySearchKeywordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersArchivedBySearchKeywordQuery({
 *   variables: {
 *      keyword: // value for 'keyword'
 *      OrderStatus: // value for 'OrderStatus'
 *   },
 * });
 */
export function useGetOrdersArchivedBySearchKeywordQuery(baseOptions: Apollo.QueryHookOptions<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables> & ({ variables: GetOrdersArchivedBySearchKeywordQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>(GetOrdersArchivedBySearchKeywordDocument, options);
      }
export function useGetOrdersArchivedBySearchKeywordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>(GetOrdersArchivedBySearchKeywordDocument, options);
        }
export function useGetOrdersArchivedBySearchKeywordSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>(GetOrdersArchivedBySearchKeywordDocument, options);
        }
export type GetOrdersArchivedBySearchKeywordQueryHookResult = ReturnType<typeof useGetOrdersArchivedBySearchKeywordQuery>;
export type GetOrdersArchivedBySearchKeywordLazyQueryHookResult = ReturnType<typeof useGetOrdersArchivedBySearchKeywordLazyQuery>;
export type GetOrdersArchivedBySearchKeywordSuspenseQueryHookResult = ReturnType<typeof useGetOrdersArchivedBySearchKeywordSuspenseQuery>;
export type GetOrdersArchivedBySearchKeywordQueryResult = Apollo.QueryResult<GetOrdersArchivedBySearchKeywordQuery, GetOrdersArchivedBySearchKeywordQueryVariables>;
export const GetOrdersArchivedByIntervalDocument = gql`
    query GetOrdersArchivedByInterval($_lte: timestamp!, $_gte: timestamp!) {
  erp_Orders(
    where: {ActualShippingDate: {_lte: $_lte, _gte: $_gte}}
    order_by: {ActualShippingDate: asc}
  ) {
    ...Order
  }
}
    ${OrderFragmentDoc}`;

/**
 * __useGetOrdersArchivedByIntervalQuery__
 *
 * To run a query within a React component, call `useGetOrdersArchivedByIntervalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersArchivedByIntervalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersArchivedByIntervalQuery({
 *   variables: {
 *      _lte: // value for '_lte'
 *      _gte: // value for '_gte'
 *   },
 * });
 */
export function useGetOrdersArchivedByIntervalQuery(baseOptions: Apollo.QueryHookOptions<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables> & ({ variables: GetOrdersArchivedByIntervalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>(GetOrdersArchivedByIntervalDocument, options);
      }
export function useGetOrdersArchivedByIntervalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>(GetOrdersArchivedByIntervalDocument, options);
        }
export function useGetOrdersArchivedByIntervalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>(GetOrdersArchivedByIntervalDocument, options);
        }
export type GetOrdersArchivedByIntervalQueryHookResult = ReturnType<typeof useGetOrdersArchivedByIntervalQuery>;
export type GetOrdersArchivedByIntervalLazyQueryHookResult = ReturnType<typeof useGetOrdersArchivedByIntervalLazyQuery>;
export type GetOrdersArchivedByIntervalSuspenseQueryHookResult = ReturnType<typeof useGetOrdersArchivedByIntervalSuspenseQuery>;
export type GetOrdersArchivedByIntervalQueryResult = Apollo.QueryResult<GetOrdersArchivedByIntervalQuery, GetOrdersArchivedByIntervalQueryVariables>;
export const GetManagersDocument = gql`
    query GetManagers {
  erp_Users(where: {AccessLevel: {AccessLevelID: {_lte: 2}}}) {
    FirstName
    LastName
    UserID
    AccessLevelID
  }
}
    `;

/**
 * __useGetManagersQuery__
 *
 * To run a query within a React component, call `useGetManagersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetManagersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetManagersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetManagersQuery(baseOptions?: Apollo.QueryHookOptions<GetManagersQuery, GetManagersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetManagersQuery, GetManagersQueryVariables>(GetManagersDocument, options);
      }
export function useGetManagersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetManagersQuery, GetManagersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetManagersQuery, GetManagersQueryVariables>(GetManagersDocument, options);
        }
export function useGetManagersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetManagersQuery, GetManagersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetManagersQuery, GetManagersQueryVariables>(GetManagersDocument, options);
        }
export type GetManagersQueryHookResult = ReturnType<typeof useGetManagersQuery>;
export type GetManagersLazyQueryHookResult = ReturnType<typeof useGetManagersLazyQuery>;
export type GetManagersSuspenseQueryHookResult = ReturnType<typeof useGetManagersSuspenseQuery>;
export type GetManagersQueryResult = Apollo.QueryResult<GetManagersQuery, GetManagersQueryVariables>;
export const GetOrderByPkDocument = gql`
    query GetOrderByPK($OrderID: Int!) {
  erp_Orders(where: {OrderID: {_eq: $OrderID}}) {
    NeedAttention
    AwaitingDispatch
    OrderStatusID
    ActualShippingDate
    AcceptanceDate
    ShippingDate
    CreatingDate
    OrderID
    ManagerID
    City
    Comment
    Entity
    InvoiceNumber
    OrderNumber
    User {
      FirstName
      LastName
      UserID
    }
    OrderItems(order_by: {OrderItemID: asc}) {
      Name
      FullName
      OrderItemID
      Quantity
    }
    Docs {
      ID
      Key
      FileName
      Size
      UploadingDate
    }
    PaidAmount
    TotalAmount
    PaymentHistories(where: {PaidAmount: {_neq: 0}}) {
      ID
      PaidAmount
      Date
    }
  }
}
    `;

/**
 * __useGetOrderByPkQuery__
 *
 * To run a query within a React component, call `useGetOrderByPkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderByPkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderByPkQuery({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *   },
 * });
 */
export function useGetOrderByPkQuery(baseOptions: Apollo.QueryHookOptions<GetOrderByPkQuery, GetOrderByPkQueryVariables> & ({ variables: GetOrderByPkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderByPkQuery, GetOrderByPkQueryVariables>(GetOrderByPkDocument, options);
      }
export function useGetOrderByPkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderByPkQuery, GetOrderByPkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderByPkQuery, GetOrderByPkQueryVariables>(GetOrderByPkDocument, options);
        }
export function useGetOrderByPkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrderByPkQuery, GetOrderByPkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrderByPkQuery, GetOrderByPkQueryVariables>(GetOrderByPkDocument, options);
        }
export type GetOrderByPkQueryHookResult = ReturnType<typeof useGetOrderByPkQuery>;
export type GetOrderByPkLazyQueryHookResult = ReturnType<typeof useGetOrderByPkLazyQuery>;
export type GetOrderByPkSuspenseQueryHookResult = ReturnType<typeof useGetOrderByPkSuspenseQuery>;
export type GetOrderByPkQueryResult = Apollo.QueryResult<GetOrderByPkQuery, GetOrderByPkQueryVariables>;
export const InsertOrderDocument = gql`
    mutation InsertOrder($orderStatusID: Int!) {
  insert_erp_Orders(objects: {OrderStatusID: $orderStatusID}) {
    returning {
      OrderID
    }
  }
}
    `;
export type InsertOrderMutationFn = Apollo.MutationFunction<InsertOrderMutation, InsertOrderMutationVariables>;

/**
 * __useInsertOrderMutation__
 *
 * To run a mutation, you first call `useInsertOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertOrderMutation, { data, loading, error }] = useInsertOrderMutation({
 *   variables: {
 *      orderStatusID: // value for 'orderStatusID'
 *   },
 * });
 */
export function useInsertOrderMutation(baseOptions?: Apollo.MutationHookOptions<InsertOrderMutation, InsertOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertOrderMutation, InsertOrderMutationVariables>(InsertOrderDocument, options);
      }
export type InsertOrderMutationHookResult = ReturnType<typeof useInsertOrderMutation>;
export type InsertOrderMutationResult = Apollo.MutationResult<InsertOrderMutation>;
export type InsertOrderMutationOptions = Apollo.BaseMutationOptions<InsertOrderMutation, InsertOrderMutationVariables>;
export const GetReclamationOrdersDocument = gql`
    query GetReclamationOrders {
  erp_Orders(where: {OrderStatusID: {_in: [10, 11, 12]}}) {
    AwaitingDispatch
    NeedAttention
    OrderID
    Entity
    City
    OrderStatusID
    OrderItems(order_by: {OrderItemID: asc}) {
      OrderItemID
      Name
    }
  }
}
    `;

/**
 * __useGetReclamationOrdersQuery__
 *
 * To run a query within a React component, call `useGetReclamationOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReclamationOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReclamationOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReclamationOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>(GetReclamationOrdersDocument, options);
      }
export function useGetReclamationOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>(GetReclamationOrdersDocument, options);
        }
export function useGetReclamationOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>(GetReclamationOrdersDocument, options);
        }
export type GetReclamationOrdersQueryHookResult = ReturnType<typeof useGetReclamationOrdersQuery>;
export type GetReclamationOrdersLazyQueryHookResult = ReturnType<typeof useGetReclamationOrdersLazyQuery>;
export type GetReclamationOrdersSuspenseQueryHookResult = ReturnType<typeof useGetReclamationOrdersSuspenseQuery>;
export type GetReclamationOrdersQueryResult = Apollo.QueryResult<GetReclamationOrdersQuery, GetReclamationOrdersQueryVariables>;
export const UpdateOrderStatusDocument = gql`
    mutation UpdateOrderStatus($OrderID: Int!, $OrderStatusID: Int!) {
  update_erp_Orders_by_pk(
    pk_columns: {OrderID: $OrderID}
    _set: {OrderStatusID: $OrderStatusID}
  ) {
    OrderID
    OrderStatusID
  }
}
    `;
export type UpdateOrderStatusMutationFn = Apollo.MutationFunction<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;

/**
 * __useUpdateOrderStatusMutation__
 *
 * To run a mutation, you first call `useUpdateOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderStatusMutation, { data, loading, error }] = useUpdateOrderStatusMutation({
 *   variables: {
 *      OrderID: // value for 'OrderID'
 *      OrderStatusID: // value for 'OrderStatusID'
 *   },
 * });
 */
export function useUpdateOrderStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(UpdateOrderStatusDocument, options);
      }
export type UpdateOrderStatusMutationHookResult = ReturnType<typeof useUpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationResult = Apollo.MutationResult<UpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationOptions = Apollo.BaseMutationOptions<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>;
export const GetDetailsDocument = gql`
    query GetDetails {
  metal_pdo_details {
    id
    name
    detail_materials {
      cost
      material {
        ...MaterialFragment
      }
    }
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetDetailsQuery__
 *
 * To run a query within a React component, call `useGetDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDetailsQuery(baseOptions?: Apollo.QueryHookOptions<GetDetailsQuery, GetDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDetailsQuery, GetDetailsQueryVariables>(GetDetailsDocument, options);
      }
export function useGetDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDetailsQuery, GetDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDetailsQuery, GetDetailsQueryVariables>(GetDetailsDocument, options);
        }
export function useGetDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDetailsQuery, GetDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDetailsQuery, GetDetailsQueryVariables>(GetDetailsDocument, options);
        }
export type GetDetailsQueryHookResult = ReturnType<typeof useGetDetailsQuery>;
export type GetDetailsLazyQueryHookResult = ReturnType<typeof useGetDetailsLazyQuery>;
export type GetDetailsSuspenseQueryHookResult = ReturnType<typeof useGetDetailsSuspenseQuery>;
export type GetDetailsQueryResult = Apollo.QueryResult<GetDetailsQuery, GetDetailsQueryVariables>;
export const GetDetailByPkDocument = gql`
    query GetDetailByPk($id: Int!) {
  metal_pdo_details_by_pk(id: $id) {
    id
    name
    detail_materials {
      cost
      material {
        ...MaterialFragment
      }
    }
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetDetailByPkQuery__
 *
 * To run a query within a React component, call `useGetDetailByPkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDetailByPkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDetailByPkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDetailByPkQuery(baseOptions: Apollo.QueryHookOptions<GetDetailByPkQuery, GetDetailByPkQueryVariables> & ({ variables: GetDetailByPkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDetailByPkQuery, GetDetailByPkQueryVariables>(GetDetailByPkDocument, options);
      }
export function useGetDetailByPkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDetailByPkQuery, GetDetailByPkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDetailByPkQuery, GetDetailByPkQueryVariables>(GetDetailByPkDocument, options);
        }
export function useGetDetailByPkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDetailByPkQuery, GetDetailByPkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDetailByPkQuery, GetDetailByPkQueryVariables>(GetDetailByPkDocument, options);
        }
export type GetDetailByPkQueryHookResult = ReturnType<typeof useGetDetailByPkQuery>;
export type GetDetailByPkLazyQueryHookResult = ReturnType<typeof useGetDetailByPkLazyQuery>;
export type GetDetailByPkSuspenseQueryHookResult = ReturnType<typeof useGetDetailByPkSuspenseQuery>;
export type GetDetailByPkQueryResult = Apollo.QueryResult<GetDetailByPkQuery, GetDetailByPkQueryVariables>;
export const InsertDetailDocument = gql`
    mutation InsertDetail($object: metal_pdo_details_insert_input!) {
  insert_metal_pdo_details_one(object: $object) {
    id
    name
  }
}
    `;
export type InsertDetailMutationFn = Apollo.MutationFunction<InsertDetailMutation, InsertDetailMutationVariables>;

/**
 * __useInsertDetailMutation__
 *
 * To run a mutation, you first call `useInsertDetailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertDetailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertDetailMutation, { data, loading, error }] = useInsertDetailMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertDetailMutation(baseOptions?: Apollo.MutationHookOptions<InsertDetailMutation, InsertDetailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertDetailMutation, InsertDetailMutationVariables>(InsertDetailDocument, options);
      }
export type InsertDetailMutationHookResult = ReturnType<typeof useInsertDetailMutation>;
export type InsertDetailMutationResult = Apollo.MutationResult<InsertDetailMutation>;
export type InsertDetailMutationOptions = Apollo.BaseMutationOptions<InsertDetailMutation, InsertDetailMutationVariables>;
export const UpdateDetailDocument = gql`
    mutation UpdateDetail($_set: metal_pdo_details_set_input!, $id: Int!) {
  update_metal_pdo_details_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
  }
}
    `;
export type UpdateDetailMutationFn = Apollo.MutationFunction<UpdateDetailMutation, UpdateDetailMutationVariables>;

/**
 * __useUpdateDetailMutation__
 *
 * To run a mutation, you first call `useUpdateDetailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDetailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDetailMutation, { data, loading, error }] = useUpdateDetailMutation({
 *   variables: {
 *      _set: // value for '_set'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateDetailMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDetailMutation, UpdateDetailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDetailMutation, UpdateDetailMutationVariables>(UpdateDetailDocument, options);
      }
export type UpdateDetailMutationHookResult = ReturnType<typeof useUpdateDetailMutation>;
export type UpdateDetailMutationResult = Apollo.MutationResult<UpdateDetailMutation>;
export type UpdateDetailMutationOptions = Apollo.BaseMutationOptions<UpdateDetailMutation, UpdateDetailMutationVariables>;
export const UpdateDetailMaterialCostDocument = gql`
    mutation UpdateDetailMaterialCost($detail_id: Int!, $material_id: Int!, $cost: numeric!) {
  update_metal_pdo_detail_materials_by_pk(
    pk_columns: {detail_id: $detail_id, material_id: $material_id}
    _set: {cost: $cost}
  ) {
    cost
  }
}
    `;
export type UpdateDetailMaterialCostMutationFn = Apollo.MutationFunction<UpdateDetailMaterialCostMutation, UpdateDetailMaterialCostMutationVariables>;

/**
 * __useUpdateDetailMaterialCostMutation__
 *
 * To run a mutation, you first call `useUpdateDetailMaterialCostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDetailMaterialCostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDetailMaterialCostMutation, { data, loading, error }] = useUpdateDetailMaterialCostMutation({
 *   variables: {
 *      detail_id: // value for 'detail_id'
 *      material_id: // value for 'material_id'
 *      cost: // value for 'cost'
 *   },
 * });
 */
export function useUpdateDetailMaterialCostMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDetailMaterialCostMutation, UpdateDetailMaterialCostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDetailMaterialCostMutation, UpdateDetailMaterialCostMutationVariables>(UpdateDetailMaterialCostDocument, options);
      }
export type UpdateDetailMaterialCostMutationHookResult = ReturnType<typeof useUpdateDetailMaterialCostMutation>;
export type UpdateDetailMaterialCostMutationResult = Apollo.MutationResult<UpdateDetailMaterialCostMutation>;
export type UpdateDetailMaterialCostMutationOptions = Apollo.BaseMutationOptions<UpdateDetailMaterialCostMutation, UpdateDetailMaterialCostMutationVariables>;
export const DeleteDetailDocument = gql`
    mutation DeleteDetail($id: Int!) {
  delete_metal_pdo_details_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteDetailMutationFn = Apollo.MutationFunction<DeleteDetailMutation, DeleteDetailMutationVariables>;

/**
 * __useDeleteDetailMutation__
 *
 * To run a mutation, you first call `useDeleteDetailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDetailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDetailMutation, { data, loading, error }] = useDeleteDetailMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDetailMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDetailMutation, DeleteDetailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDetailMutation, DeleteDetailMutationVariables>(DeleteDetailDocument, options);
      }
export type DeleteDetailMutationHookResult = ReturnType<typeof useDeleteDetailMutation>;
export type DeleteDetailMutationResult = Apollo.MutationResult<DeleteDetailMutation>;
export type DeleteDetailMutationOptions = Apollo.BaseMutationOptions<DeleteDetailMutation, DeleteDetailMutationVariables>;
export const GetDetailMaterialsDocument = gql`
    query GetDetailMaterials($_eq: Int!) {
  metal_pdo_detail_materials(where: {material_id: {_eq: $_eq}}) {
    material {
      ...MaterialFragment
    }
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetDetailMaterialsQuery__
 *
 * To run a query within a React component, call `useGetDetailMaterialsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDetailMaterialsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDetailMaterialsQuery({
 *   variables: {
 *      _eq: // value for '_eq'
 *   },
 * });
 */
export function useGetDetailMaterialsQuery(baseOptions: Apollo.QueryHookOptions<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables> & ({ variables: GetDetailMaterialsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>(GetDetailMaterialsDocument, options);
      }
export function useGetDetailMaterialsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>(GetDetailMaterialsDocument, options);
        }
export function useGetDetailMaterialsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>(GetDetailMaterialsDocument, options);
        }
export type GetDetailMaterialsQueryHookResult = ReturnType<typeof useGetDetailMaterialsQuery>;
export type GetDetailMaterialsLazyQueryHookResult = ReturnType<typeof useGetDetailMaterialsLazyQuery>;
export type GetDetailMaterialsSuspenseQueryHookResult = ReturnType<typeof useGetDetailMaterialsSuspenseQuery>;
export type GetDetailMaterialsQueryResult = Apollo.QueryResult<GetDetailMaterialsQuery, GetDetailMaterialsQueryVariables>;
export const GetDetailsMadeFromThatMaterialDocument = gql`
    query GetDetailsMadeFromThatMaterial($_eq: Int!) {
  metal_pdo_detail_materials(where: {material_id: {_eq: $_eq}}) {
    detail {
      id
      name
    }
  }
}
    `;

/**
 * __useGetDetailsMadeFromThatMaterialQuery__
 *
 * To run a query within a React component, call `useGetDetailsMadeFromThatMaterialQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDetailsMadeFromThatMaterialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDetailsMadeFromThatMaterialQuery({
 *   variables: {
 *      _eq: // value for '_eq'
 *   },
 * });
 */
export function useGetDetailsMadeFromThatMaterialQuery(baseOptions: Apollo.QueryHookOptions<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables> & ({ variables: GetDetailsMadeFromThatMaterialQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>(GetDetailsMadeFromThatMaterialDocument, options);
      }
export function useGetDetailsMadeFromThatMaterialLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>(GetDetailsMadeFromThatMaterialDocument, options);
        }
export function useGetDetailsMadeFromThatMaterialSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>(GetDetailsMadeFromThatMaterialDocument, options);
        }
export type GetDetailsMadeFromThatMaterialQueryHookResult = ReturnType<typeof useGetDetailsMadeFromThatMaterialQuery>;
export type GetDetailsMadeFromThatMaterialLazyQueryHookResult = ReturnType<typeof useGetDetailsMadeFromThatMaterialLazyQuery>;
export type GetDetailsMadeFromThatMaterialSuspenseQueryHookResult = ReturnType<typeof useGetDetailsMadeFromThatMaterialSuspenseQuery>;
export type GetDetailsMadeFromThatMaterialQueryResult = Apollo.QueryResult<GetDetailsMadeFromThatMaterialQuery, GetDetailsMadeFromThatMaterialQueryVariables>;
export const InsertDetailMaterialsDocument = gql`
    mutation InsertDetailMaterials($objects: [metal_pdo_detail_materials_insert_input!]!) {
  insert_metal_pdo_detail_materials(
    objects: $objects
    on_conflict: {constraint: detail_materials_p_key}
  ) {
    affected_rows
    returning {
      detail_id
      material_id
    }
  }
}
    `;
export type InsertDetailMaterialsMutationFn = Apollo.MutationFunction<InsertDetailMaterialsMutation, InsertDetailMaterialsMutationVariables>;

/**
 * __useInsertDetailMaterialsMutation__
 *
 * To run a mutation, you first call `useInsertDetailMaterialsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertDetailMaterialsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertDetailMaterialsMutation, { data, loading, error }] = useInsertDetailMaterialsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useInsertDetailMaterialsMutation(baseOptions?: Apollo.MutationHookOptions<InsertDetailMaterialsMutation, InsertDetailMaterialsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertDetailMaterialsMutation, InsertDetailMaterialsMutationVariables>(InsertDetailMaterialsDocument, options);
      }
export type InsertDetailMaterialsMutationHookResult = ReturnType<typeof useInsertDetailMaterialsMutation>;
export type InsertDetailMaterialsMutationResult = Apollo.MutationResult<InsertDetailMaterialsMutation>;
export type InsertDetailMaterialsMutationOptions = Apollo.BaseMutationOptions<InsertDetailMaterialsMutation, InsertDetailMaterialsMutationVariables>;
export const GetMaterialsDocument = gql`
    query GetMaterials {
  metal_pdo_materials {
    ...MaterialFragment
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetMaterialsQuery__
 *
 * To run a query within a React component, call `useGetMaterialsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMaterialsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMaterialsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMaterialsQuery(baseOptions?: Apollo.QueryHookOptions<GetMaterialsQuery, GetMaterialsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMaterialsQuery, GetMaterialsQueryVariables>(GetMaterialsDocument, options);
      }
export function useGetMaterialsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMaterialsQuery, GetMaterialsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMaterialsQuery, GetMaterialsQueryVariables>(GetMaterialsDocument, options);
        }
export function useGetMaterialsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialsQuery, GetMaterialsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMaterialsQuery, GetMaterialsQueryVariables>(GetMaterialsDocument, options);
        }
export type GetMaterialsQueryHookResult = ReturnType<typeof useGetMaterialsQuery>;
export type GetMaterialsLazyQueryHookResult = ReturnType<typeof useGetMaterialsLazyQuery>;
export type GetMaterialsSuspenseQueryHookResult = ReturnType<typeof useGetMaterialsSuspenseQuery>;
export type GetMaterialsQueryResult = Apollo.QueryResult<GetMaterialsQuery, GetMaterialsQueryVariables>;
export const GetMaterialByPkDocument = gql`
    query GetMaterialByPk($id: Int!) {
  metal_pdo_materials_by_pk(id: $id) {
    ...MaterialFragment
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetMaterialByPkQuery__
 *
 * To run a query within a React component, call `useGetMaterialByPkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMaterialByPkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMaterialByPkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMaterialByPkQuery(baseOptions: Apollo.QueryHookOptions<GetMaterialByPkQuery, GetMaterialByPkQueryVariables> & ({ variables: GetMaterialByPkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>(GetMaterialByPkDocument, options);
      }
export function useGetMaterialByPkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>(GetMaterialByPkDocument, options);
        }
export function useGetMaterialByPkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>(GetMaterialByPkDocument, options);
        }
export type GetMaterialByPkQueryHookResult = ReturnType<typeof useGetMaterialByPkQuery>;
export type GetMaterialByPkLazyQueryHookResult = ReturnType<typeof useGetMaterialByPkLazyQuery>;
export type GetMaterialByPkSuspenseQueryHookResult = ReturnType<typeof useGetMaterialByPkSuspenseQuery>;
export type GetMaterialByPkQueryResult = Apollo.QueryResult<GetMaterialByPkQuery, GetMaterialByPkQueryVariables>;
export const GetCirclePossibleAlloysDocument = gql`
    query GetCirclePossibleAlloys($_eq: Int!) {
  metal_pdo_materials(where: {shape: {_eq: $_eq}}) {
    shape_data(path: "alloy")
  }
}
    `;

/**
 * __useGetCirclePossibleAlloysQuery__
 *
 * To run a query within a React component, call `useGetCirclePossibleAlloysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCirclePossibleAlloysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCirclePossibleAlloysQuery({
 *   variables: {
 *      _eq: // value for '_eq'
 *   },
 * });
 */
export function useGetCirclePossibleAlloysQuery(baseOptions: Apollo.QueryHookOptions<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables> & ({ variables: GetCirclePossibleAlloysQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>(GetCirclePossibleAlloysDocument, options);
      }
export function useGetCirclePossibleAlloysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>(GetCirclePossibleAlloysDocument, options);
        }
export function useGetCirclePossibleAlloysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>(GetCirclePossibleAlloysDocument, options);
        }
export type GetCirclePossibleAlloysQueryHookResult = ReturnType<typeof useGetCirclePossibleAlloysQuery>;
export type GetCirclePossibleAlloysLazyQueryHookResult = ReturnType<typeof useGetCirclePossibleAlloysLazyQuery>;
export type GetCirclePossibleAlloysSuspenseQueryHookResult = ReturnType<typeof useGetCirclePossibleAlloysSuspenseQuery>;
export type GetCirclePossibleAlloysQueryResult = Apollo.QueryResult<GetCirclePossibleAlloysQuery, GetCirclePossibleAlloysQueryVariables>;
export const InsertMaterialDocument = gql`
    mutation InsertMaterial($object: metal_pdo_materials_insert_input!) {
  insert_metal_pdo_materials_one(object: $object) {
    id
  }
}
    `;
export type InsertMaterialMutationFn = Apollo.MutationFunction<InsertMaterialMutation, InsertMaterialMutationVariables>;

/**
 * __useInsertMaterialMutation__
 *
 * To run a mutation, you first call `useInsertMaterialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertMaterialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertMaterialMutation, { data, loading, error }] = useInsertMaterialMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertMaterialMutation(baseOptions?: Apollo.MutationHookOptions<InsertMaterialMutation, InsertMaterialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertMaterialMutation, InsertMaterialMutationVariables>(InsertMaterialDocument, options);
      }
export type InsertMaterialMutationHookResult = ReturnType<typeof useInsertMaterialMutation>;
export type InsertMaterialMutationResult = Apollo.MutationResult<InsertMaterialMutation>;
export type InsertMaterialMutationOptions = Apollo.BaseMutationOptions<InsertMaterialMutation, InsertMaterialMutationVariables>;
export const UpdateMaterialDocument = gql`
    mutation UpdateMaterial($id: Int!, $_set: metal_pdo_materials_set_input!) {
  update_metal_pdo_materials_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
  }
}
    `;
export type UpdateMaterialMutationFn = Apollo.MutationFunction<UpdateMaterialMutation, UpdateMaterialMutationVariables>;

/**
 * __useUpdateMaterialMutation__
 *
 * To run a mutation, you first call `useUpdateMaterialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMaterialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMaterialMutation, { data, loading, error }] = useUpdateMaterialMutation({
 *   variables: {
 *      id: // value for 'id'
 *      _set: // value for '_set'
 *   },
 * });
 */
export function useUpdateMaterialMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMaterialMutation, UpdateMaterialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMaterialMutation, UpdateMaterialMutationVariables>(UpdateMaterialDocument, options);
      }
export type UpdateMaterialMutationHookResult = ReturnType<typeof useUpdateMaterialMutation>;
export type UpdateMaterialMutationResult = Apollo.MutationResult<UpdateMaterialMutation>;
export type UpdateMaterialMutationOptions = Apollo.BaseMutationOptions<UpdateMaterialMutation, UpdateMaterialMutationVariables>;
export const DeleteMaterialDocument = gql`
    mutation DeleteMaterial($id: Int!) {
  delete_metal_pdo_materials_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteMaterialMutationFn = Apollo.MutationFunction<DeleteMaterialMutation, DeleteMaterialMutationVariables>;

/**
 * __useDeleteMaterialMutation__
 *
 * To run a mutation, you first call `useDeleteMaterialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMaterialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMaterialMutation, { data, loading, error }] = useDeleteMaterialMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMaterialMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMaterialMutation, DeleteMaterialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMaterialMutation, DeleteMaterialMutationVariables>(DeleteMaterialDocument, options);
      }
export type DeleteMaterialMutationHookResult = ReturnType<typeof useDeleteMaterialMutation>;
export type DeleteMaterialMutationResult = Apollo.MutationResult<DeleteMaterialMutation>;
export type DeleteMaterialMutationOptions = Apollo.BaseMutationOptions<DeleteMaterialMutation, DeleteMaterialMutationVariables>;
export const InsertMaterialSupplyDocument = gql`
    mutation InsertMaterialSupply($object: metal_pdo_supplies_insert_input!) {
  insert_metal_pdo_supplies_one(object: $object) {
    id
  }
}
    `;
export type InsertMaterialSupplyMutationFn = Apollo.MutationFunction<InsertMaterialSupplyMutation, InsertMaterialSupplyMutationVariables>;

/**
 * __useInsertMaterialSupplyMutation__
 *
 * To run a mutation, you first call `useInsertMaterialSupplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertMaterialSupplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertMaterialSupplyMutation, { data, loading, error }] = useInsertMaterialSupplyMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertMaterialSupplyMutation(baseOptions?: Apollo.MutationHookOptions<InsertMaterialSupplyMutation, InsertMaterialSupplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertMaterialSupplyMutation, InsertMaterialSupplyMutationVariables>(InsertMaterialSupplyDocument, options);
      }
export type InsertMaterialSupplyMutationHookResult = ReturnType<typeof useInsertMaterialSupplyMutation>;
export type InsertMaterialSupplyMutationResult = Apollo.MutationResult<InsertMaterialSupplyMutation>;
export type InsertMaterialSupplyMutationOptions = Apollo.BaseMutationOptions<InsertMaterialSupplyMutation, InsertMaterialSupplyMutationVariables>;
export const GetSuppliesDocument = gql`
    query GetSupplies {
  metal_pdo_supplies(order_by: {id: desc}) {
    id
    material_id
    qty
    supplied_at
    supplier_name
    material {
      ...MaterialFragment
    }
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetSuppliesQuery__
 *
 * To run a query within a React component, call `useGetSuppliesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSuppliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSuppliesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSuppliesQuery(baseOptions?: Apollo.QueryHookOptions<GetSuppliesQuery, GetSuppliesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSuppliesQuery, GetSuppliesQueryVariables>(GetSuppliesDocument, options);
      }
export function useGetSuppliesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSuppliesQuery, GetSuppliesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSuppliesQuery, GetSuppliesQueryVariables>(GetSuppliesDocument, options);
        }
export function useGetSuppliesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSuppliesQuery, GetSuppliesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSuppliesQuery, GetSuppliesQueryVariables>(GetSuppliesDocument, options);
        }
export type GetSuppliesQueryHookResult = ReturnType<typeof useGetSuppliesQuery>;
export type GetSuppliesLazyQueryHookResult = ReturnType<typeof useGetSuppliesLazyQuery>;
export type GetSuppliesSuspenseQueryHookResult = ReturnType<typeof useGetSuppliesSuspenseQuery>;
export type GetSuppliesQueryResult = Apollo.QueryResult<GetSuppliesQuery, GetSuppliesQueryVariables>;
export const DeleteSupplyDocument = gql`
    mutation DeleteSupply($id: Int!) {
  delete_metal_pdo_supplies_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteSupplyMutationFn = Apollo.MutationFunction<DeleteSupplyMutation, DeleteSupplyMutationVariables>;

/**
 * __useDeleteSupplyMutation__
 *
 * To run a mutation, you first call `useDeleteSupplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSupplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSupplyMutation, { data, loading, error }] = useDeleteSupplyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSupplyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSupplyMutation, DeleteSupplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSupplyMutation, DeleteSupplyMutationVariables>(DeleteSupplyDocument, options);
      }
export type DeleteSupplyMutationHookResult = ReturnType<typeof useDeleteSupplyMutation>;
export type DeleteSupplyMutationResult = Apollo.MutationResult<DeleteSupplyMutation>;
export type DeleteSupplyMutationOptions = Apollo.BaseMutationOptions<DeleteSupplyMutation, DeleteSupplyMutationVariables>;
export const InsertMaterialWriteoffDocument = gql`
    mutation InsertMaterialWriteoff($objects: [metal_pdo_writeoffs_insert_input!]!) {
  insert_metal_pdo_writeoffs(objects: $objects) {
    affected_rows
  }
}
    `;
export type InsertMaterialWriteoffMutationFn = Apollo.MutationFunction<InsertMaterialWriteoffMutation, InsertMaterialWriteoffMutationVariables>;

/**
 * __useInsertMaterialWriteoffMutation__
 *
 * To run a mutation, you first call `useInsertMaterialWriteoffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertMaterialWriteoffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertMaterialWriteoffMutation, { data, loading, error }] = useInsertMaterialWriteoffMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useInsertMaterialWriteoffMutation(baseOptions?: Apollo.MutationHookOptions<InsertMaterialWriteoffMutation, InsertMaterialWriteoffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertMaterialWriteoffMutation, InsertMaterialWriteoffMutationVariables>(InsertMaterialWriteoffDocument, options);
      }
export type InsertMaterialWriteoffMutationHookResult = ReturnType<typeof useInsertMaterialWriteoffMutation>;
export type InsertMaterialWriteoffMutationResult = Apollo.MutationResult<InsertMaterialWriteoffMutation>;
export type InsertMaterialWriteoffMutationOptions = Apollo.BaseMutationOptions<InsertMaterialWriteoffMutation, InsertMaterialWriteoffMutationVariables>;
export const GetWrietOffsDocument = gql`
    query GetWrietOffs {
  metal_pdo_writeoffs(order_by: {id: desc}) {
    id
    date
    qty
    type
    type_data
    reason
    material {
      ...MaterialFragment
    }
  }
}
    ${MaterialFragmentFragmentDoc}`;

/**
 * __useGetWrietOffsQuery__
 *
 * To run a query within a React component, call `useGetWrietOffsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWrietOffsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWrietOffsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetWrietOffsQuery(baseOptions?: Apollo.QueryHookOptions<GetWrietOffsQuery, GetWrietOffsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWrietOffsQuery, GetWrietOffsQueryVariables>(GetWrietOffsDocument, options);
      }
export function useGetWrietOffsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWrietOffsQuery, GetWrietOffsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWrietOffsQuery, GetWrietOffsQueryVariables>(GetWrietOffsDocument, options);
        }
export function useGetWrietOffsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWrietOffsQuery, GetWrietOffsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWrietOffsQuery, GetWrietOffsQueryVariables>(GetWrietOffsDocument, options);
        }
export type GetWrietOffsQueryHookResult = ReturnType<typeof useGetWrietOffsQuery>;
export type GetWrietOffsLazyQueryHookResult = ReturnType<typeof useGetWrietOffsLazyQuery>;
export type GetWrietOffsSuspenseQueryHookResult = ReturnType<typeof useGetWrietOffsSuspenseQuery>;
export type GetWrietOffsQueryResult = Apollo.QueryResult<GetWrietOffsQuery, GetWrietOffsQueryVariables>;
export const DeleteWriteOffDocument = gql`
    mutation DeleteWriteOff($id: Int!) {
  delete_metal_pdo_writeoffs_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteWriteOffMutationFn = Apollo.MutationFunction<DeleteWriteOffMutation, DeleteWriteOffMutationVariables>;

/**
 * __useDeleteWriteOffMutation__
 *
 * To run a mutation, you first call `useDeleteWriteOffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWriteOffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWriteOffMutation, { data, loading, error }] = useDeleteWriteOffMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteWriteOffMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWriteOffMutation, DeleteWriteOffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWriteOffMutation, DeleteWriteOffMutationVariables>(DeleteWriteOffDocument, options);
      }
export type DeleteWriteOffMutationHookResult = ReturnType<typeof useDeleteWriteOffMutation>;
export type DeleteWriteOffMutationResult = Apollo.MutationResult<DeleteWriteOffMutation>;
export type DeleteWriteOffMutationOptions = Apollo.BaseMutationOptions<DeleteWriteOffMutation, DeleteWriteOffMutationVariables>;