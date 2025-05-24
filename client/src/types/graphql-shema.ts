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

/** columns and relationships of "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials = {
  __typename?: 'metal_flow_detail_materials';
  data?: Maybe<Scalars['jsonb']['output']>;
  /** An object relationship */
  detail: Metal_Flow_Details;
  detail_id: Scalars['Int']['output'];
  /** An object relationship */
  material: Metal_Flow_Materials;
  material_id: Scalars['Int']['output'];
};


/** columns and relationships of "metal_flow.detail_materials" */
export type Metal_Flow_Detail_MaterialsDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Aggregate = {
  __typename?: 'metal_flow_detail_materials_aggregate';
  aggregate?: Maybe<Metal_Flow_Detail_Materials_Aggregate_Fields>;
  nodes: Array<Metal_Flow_Detail_Materials>;
};

export type Metal_Flow_Detail_Materials_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Flow_Detail_Materials_Aggregate_Bool_Exp_Count>;
};

export type Metal_Flow_Detail_Materials_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Aggregate_Fields = {
  __typename?: 'metal_flow_detail_materials_aggregate_fields';
  avg?: Maybe<Metal_Flow_Detail_Materials_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Flow_Detail_Materials_Max_Fields>;
  min?: Maybe<Metal_Flow_Detail_Materials_Min_Fields>;
  stddev?: Maybe<Metal_Flow_Detail_Materials_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Flow_Detail_Materials_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Flow_Detail_Materials_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Flow_Detail_Materials_Sum_Fields>;
  var_pop?: Maybe<Metal_Flow_Detail_Materials_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Flow_Detail_Materials_Var_Samp_Fields>;
  variance?: Maybe<Metal_Flow_Detail_Materials_Variance_Fields>;
};


/** aggregate fields of "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Flow_Detail_Materials_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Flow_Detail_Materials_Max_Order_By>;
  min?: InputMaybe<Metal_Flow_Detail_Materials_Min_Order_By>;
  stddev?: InputMaybe<Metal_Flow_Detail_Materials_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Flow_Detail_Materials_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Flow_Detail_Materials_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Flow_Detail_Materials_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Flow_Detail_Materials_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Flow_Detail_Materials_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Flow_Detail_Materials_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Detail_Materials_Append_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Arr_Rel_Insert_Input = {
  data: Array<Metal_Flow_Detail_Materials_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Flow_Detail_Materials_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Flow_Detail_Materials_Avg_Fields = {
  __typename?: 'metal_flow_detail_materials_avg_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Avg_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_flow.detail_materials". All fields are combined with a logical 'AND'. */
export type Metal_Flow_Detail_Materials_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Flow_Detail_Materials_Bool_Exp>>;
  _not?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Flow_Detail_Materials_Bool_Exp>>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  detail?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
  detail_id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_flow.detail_materials" */
export enum Metal_Flow_Detail_Materials_Constraint {
  /** unique or primary key constraint on columns "material_id", "detail_id" */
  DetailMaterialsPKey = 'detail_materials_p_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Metal_Flow_Detail_Materials_Delete_At_Path_Input = {
  data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Metal_Flow_Detail_Materials_Delete_Elem_Input = {
  data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Metal_Flow_Detail_Materials_Delete_Key_Input = {
  data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Inc_Input = {
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Insert_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
  detail?: InputMaybe<Metal_Flow_Details_Obj_Rel_Insert_Input>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Flow_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Metal_Flow_Detail_Materials_Max_Fields = {
  __typename?: 'metal_flow_detail_materials_max_fields';
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Max_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Flow_Detail_Materials_Min_Fields = {
  __typename?: 'metal_flow_detail_materials_min_fields';
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Min_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Mutation_Response = {
  __typename?: 'metal_flow_detail_materials_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Flow_Detail_Materials>;
};

/** on_conflict condition type for table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_On_Conflict = {
  constraint: Metal_Flow_Detail_Materials_Constraint;
  update_columns?: Array<Metal_Flow_Detail_Materials_Update_Column>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_flow.detail_materials". */
export type Metal_Flow_Detail_Materials_Order_By = {
  data?: InputMaybe<Order_By>;
  detail?: InputMaybe<Metal_Flow_Details_Order_By>;
  detail_id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Flow_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_flow.detail_materials */
export type Metal_Flow_Detail_Materials_Pk_Columns_Input = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Detail_Materials_Prepend_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "metal_flow.detail_materials" */
export enum Metal_Flow_Detail_Materials_Select_Column {
  /** column name */
  Data = 'data',
  /** column name */
  DetailId = 'detail_id',
  /** column name */
  MaterialId = 'material_id'
}

/** input type for updating data in table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Set_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Flow_Detail_Materials_Stddev_Fields = {
  __typename?: 'metal_flow_detail_materials_stddev_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Stddev_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Flow_Detail_Materials_Stddev_Pop_Fields = {
  __typename?: 'metal_flow_detail_materials_stddev_pop_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Stddev_Pop_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Flow_Detail_Materials_Stddev_Samp_Fields = {
  __typename?: 'metal_flow_detail_materials_stddev_samp_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Stddev_Samp_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_flow_detail_materials" */
export type Metal_Flow_Detail_Materials_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Flow_Detail_Materials_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Flow_Detail_Materials_Stream_Cursor_Value_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
  detail_id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Metal_Flow_Detail_Materials_Sum_Fields = {
  __typename?: 'metal_flow_detail_materials_sum_fields';
  detail_id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Sum_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** update columns of table "metal_flow.detail_materials" */
export enum Metal_Flow_Detail_Materials_Update_Column {
  /** column name */
  Data = 'data',
  /** column name */
  DetailId = 'detail_id',
  /** column name */
  MaterialId = 'material_id'
}

export type Metal_Flow_Detail_Materials_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Metal_Flow_Detail_Materials_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Metal_Flow_Detail_Materials_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Flow_Detail_Materials_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Metal_Flow_Detail_Materials_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Flow_Detail_Materials_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Flow_Detail_Materials_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Flow_Detail_Materials_Var_Pop_Fields = {
  __typename?: 'metal_flow_detail_materials_var_pop_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Var_Pop_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Flow_Detail_Materials_Var_Samp_Fields = {
  __typename?: 'metal_flow_detail_materials_var_samp_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Var_Samp_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Flow_Detail_Materials_Variance_Fields = {
  __typename?: 'metal_flow_detail_materials_variance_fields';
  detail_id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_flow.detail_materials" */
export type Metal_Flow_Detail_Materials_Variance_Order_By = {
  detail_id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "metal_flow.details" */
export type Metal_Flow_Details = {
  __typename?: 'metal_flow_details';
  /** An array relationship */
  detail_materials: Array<Metal_Flow_Detail_Materials>;
  /** An aggregate relationship */
  detail_materials_aggregate: Metal_Flow_Detail_Materials_Aggregate;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};


/** columns and relationships of "metal_flow.details" */
export type Metal_Flow_DetailsDetail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_flow.details" */
export type Metal_Flow_DetailsDetail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};

/** aggregated selection of "metal_flow.details" */
export type Metal_Flow_Details_Aggregate = {
  __typename?: 'metal_flow_details_aggregate';
  aggregate?: Maybe<Metal_Flow_Details_Aggregate_Fields>;
  nodes: Array<Metal_Flow_Details>;
};

/** aggregate fields of "metal_flow.details" */
export type Metal_Flow_Details_Aggregate_Fields = {
  __typename?: 'metal_flow_details_aggregate_fields';
  avg?: Maybe<Metal_Flow_Details_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Flow_Details_Max_Fields>;
  min?: Maybe<Metal_Flow_Details_Min_Fields>;
  stddev?: Maybe<Metal_Flow_Details_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Flow_Details_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Flow_Details_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Flow_Details_Sum_Fields>;
  var_pop?: Maybe<Metal_Flow_Details_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Flow_Details_Var_Samp_Fields>;
  variance?: Maybe<Metal_Flow_Details_Variance_Fields>;
};


/** aggregate fields of "metal_flow.details" */
export type Metal_Flow_Details_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Flow_Details_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Metal_Flow_Details_Avg_Fields = {
  __typename?: 'metal_flow_details_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "metal_flow.details". All fields are combined with a logical 'AND'. */
export type Metal_Flow_Details_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Flow_Details_Bool_Exp>>;
  _not?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Flow_Details_Bool_Exp>>;
  detail_materials?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
  detail_materials_aggregate?: InputMaybe<Metal_Flow_Detail_Materials_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_flow.details" */
export enum Metal_Flow_Details_Constraint {
  /** unique or primary key constraint on columns "name" */
  DetailNameUniqueIdx = 'detail_name_unique_idx',
  /** unique or primary key constraint on columns "id" */
  DetailsPkey = 'details_pkey'
}

/** input type for incrementing numeric columns in table "metal_flow.details" */
export type Metal_Flow_Details_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_flow.details" */
export type Metal_Flow_Details_Insert_Input = {
  detail_materials?: InputMaybe<Metal_Flow_Detail_Materials_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Metal_Flow_Details_Max_Fields = {
  __typename?: 'metal_flow_details_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Metal_Flow_Details_Min_Fields = {
  __typename?: 'metal_flow_details_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "metal_flow.details" */
export type Metal_Flow_Details_Mutation_Response = {
  __typename?: 'metal_flow_details_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Flow_Details>;
};

/** input type for inserting object relation for remote table "metal_flow.details" */
export type Metal_Flow_Details_Obj_Rel_Insert_Input = {
  data: Metal_Flow_Details_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Flow_Details_On_Conflict>;
};

/** on_conflict condition type for table "metal_flow.details" */
export type Metal_Flow_Details_On_Conflict = {
  constraint: Metal_Flow_Details_Constraint;
  update_columns?: Array<Metal_Flow_Details_Update_Column>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_flow.details". */
export type Metal_Flow_Details_Order_By = {
  detail_materials_aggregate?: InputMaybe<Metal_Flow_Detail_Materials_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_flow.details */
export type Metal_Flow_Details_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "metal_flow.details" */
export enum Metal_Flow_Details_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "metal_flow.details" */
export type Metal_Flow_Details_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Flow_Details_Stddev_Fields = {
  __typename?: 'metal_flow_details_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Metal_Flow_Details_Stddev_Pop_Fields = {
  __typename?: 'metal_flow_details_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Metal_Flow_Details_Stddev_Samp_Fields = {
  __typename?: 'metal_flow_details_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "metal_flow_details" */
export type Metal_Flow_Details_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Flow_Details_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Flow_Details_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Metal_Flow_Details_Sum_Fields = {
  __typename?: 'metal_flow_details_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "metal_flow.details" */
export enum Metal_Flow_Details_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Metal_Flow_Details_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Flow_Details_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Flow_Details_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Flow_Details_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Flow_Details_Var_Pop_Fields = {
  __typename?: 'metal_flow_details_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Metal_Flow_Details_Var_Samp_Fields = {
  __typename?: 'metal_flow_details_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Metal_Flow_Details_Variance_Fields = {
  __typename?: 'metal_flow_details_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_Materials = {
  __typename?: 'metal_flow_materials';
  /** An array relationship */
  detail_materials: Array<Metal_Flow_Detail_Materials>;
  /** An aggregate relationship */
  detail_materials_aggregate: Metal_Flow_Detail_Materials_Aggregate;
  id: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  shape: Scalars['Int']['output'];
  shape_data?: Maybe<Scalars['jsonb']['output']>;
  /** An array relationship */
  supplies: Array<Metal_Flow_Supplies>;
  /** An aggregate relationship */
  supplies_aggregate: Metal_Flow_Supplies_Aggregate;
  unit: Scalars['Int']['output'];
  /** An array relationship */
  writeoffs: Array<Metal_Flow_Writeoffs>;
  /** An aggregate relationship */
  writeoffs_aggregate: Metal_Flow_Writeoffs_Aggregate;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsDetail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsDetail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsShape_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsSuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsSupplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsWriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


/** columns and relationships of "metal_flow.materials" */
export type Metal_Flow_MaterialsWriteoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};

/** aggregated selection of "metal_flow.materials" */
export type Metal_Flow_Materials_Aggregate = {
  __typename?: 'metal_flow_materials_aggregate';
  aggregate?: Maybe<Metal_Flow_Materials_Aggregate_Fields>;
  nodes: Array<Metal_Flow_Materials>;
};

/** aggregate fields of "metal_flow.materials" */
export type Metal_Flow_Materials_Aggregate_Fields = {
  __typename?: 'metal_flow_materials_aggregate_fields';
  avg?: Maybe<Metal_Flow_Materials_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Flow_Materials_Max_Fields>;
  min?: Maybe<Metal_Flow_Materials_Min_Fields>;
  stddev?: Maybe<Metal_Flow_Materials_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Flow_Materials_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Flow_Materials_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Flow_Materials_Sum_Fields>;
  var_pop?: Maybe<Metal_Flow_Materials_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Flow_Materials_Var_Samp_Fields>;
  variance?: Maybe<Metal_Flow_Materials_Variance_Fields>;
};


/** aggregate fields of "metal_flow.materials" */
export type Metal_Flow_Materials_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Flow_Materials_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Materials_Append_Input = {
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Metal_Flow_Materials_Avg_Fields = {
  __typename?: 'metal_flow_materials_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "metal_flow.materials". All fields are combined with a logical 'AND'. */
export type Metal_Flow_Materials_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Flow_Materials_Bool_Exp>>;
  _not?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Flow_Materials_Bool_Exp>>;
  detail_materials?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
  detail_materials_aggregate?: InputMaybe<Metal_Flow_Detail_Materials_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  shape?: InputMaybe<Int_Comparison_Exp>;
  shape_data?: InputMaybe<Jsonb_Comparison_Exp>;
  supplies?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
  supplies_aggregate?: InputMaybe<Metal_Flow_Supplies_Aggregate_Bool_Exp>;
  unit?: InputMaybe<Int_Comparison_Exp>;
  writeoffs?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
  writeoffs_aggregate?: InputMaybe<Metal_Flow_Writeoffs_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "metal_flow.materials" */
export enum Metal_Flow_Materials_Constraint {
  /** unique or primary key constraint on columns "label" */
  MaterialsLabelKey = 'materials_label_key',
  /** unique or primary key constraint on columns "id" */
  MaterialsPkey = 'materials_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Metal_Flow_Materials_Delete_At_Path_Input = {
  shape_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Metal_Flow_Materials_Delete_Elem_Input = {
  shape_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Metal_Flow_Materials_Delete_Key_Input = {
  shape_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "metal_flow.materials" */
export type Metal_Flow_Materials_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_flow.materials" */
export type Metal_Flow_Materials_Insert_Input = {
  detail_materials?: InputMaybe<Metal_Flow_Detail_Materials_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  supplies?: InputMaybe<Metal_Flow_Supplies_Arr_Rel_Insert_Input>;
  unit?: InputMaybe<Scalars['Int']['input']>;
  writeoffs?: InputMaybe<Metal_Flow_Writeoffs_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Metal_Flow_Materials_Max_Fields = {
  __typename?: 'metal_flow_materials_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Metal_Flow_Materials_Min_Fields = {
  __typename?: 'metal_flow_materials_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "metal_flow.materials" */
export type Metal_Flow_Materials_Mutation_Response = {
  __typename?: 'metal_flow_materials_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Flow_Materials>;
};

/** input type for inserting object relation for remote table "metal_flow.materials" */
export type Metal_Flow_Materials_Obj_Rel_Insert_Input = {
  data: Metal_Flow_Materials_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Flow_Materials_On_Conflict>;
};

/** on_conflict condition type for table "metal_flow.materials" */
export type Metal_Flow_Materials_On_Conflict = {
  constraint: Metal_Flow_Materials_Constraint;
  update_columns?: Array<Metal_Flow_Materials_Update_Column>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_flow.materials". */
export type Metal_Flow_Materials_Order_By = {
  detail_materials_aggregate?: InputMaybe<Metal_Flow_Detail_Materials_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  shape?: InputMaybe<Order_By>;
  shape_data?: InputMaybe<Order_By>;
  supplies_aggregate?: InputMaybe<Metal_Flow_Supplies_Aggregate_Order_By>;
  unit?: InputMaybe<Order_By>;
  writeoffs_aggregate?: InputMaybe<Metal_Flow_Writeoffs_Aggregate_Order_By>;
};

/** primary key columns input for table: metal_flow.materials */
export type Metal_Flow_Materials_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Materials_Prepend_Input = {
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "metal_flow.materials" */
export enum Metal_Flow_Materials_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Shape = 'shape',
  /** column name */
  ShapeData = 'shape_data',
  /** column name */
  Unit = 'unit'
}

/** input type for updating data in table "metal_flow.materials" */
export type Metal_Flow_Materials_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Flow_Materials_Stddev_Fields = {
  __typename?: 'metal_flow_materials_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Metal_Flow_Materials_Stddev_Pop_Fields = {
  __typename?: 'metal_flow_materials_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Metal_Flow_Materials_Stddev_Samp_Fields = {
  __typename?: 'metal_flow_materials_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "metal_flow_materials" */
export type Metal_Flow_Materials_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Flow_Materials_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Flow_Materials_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  shape?: InputMaybe<Scalars['Int']['input']>;
  shape_data?: InputMaybe<Scalars['jsonb']['input']>;
  unit?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Metal_Flow_Materials_Sum_Fields = {
  __typename?: 'metal_flow_materials_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  shape?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "metal_flow.materials" */
export enum Metal_Flow_Materials_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Shape = 'shape',
  /** column name */
  ShapeData = 'shape_data',
  /** column name */
  Unit = 'unit'
}

export type Metal_Flow_Materials_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Metal_Flow_Materials_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Metal_Flow_Materials_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Metal_Flow_Materials_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Metal_Flow_Materials_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Flow_Materials_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Metal_Flow_Materials_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Flow_Materials_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Flow_Materials_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Flow_Materials_Var_Pop_Fields = {
  __typename?: 'metal_flow_materials_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Metal_Flow_Materials_Var_Samp_Fields = {
  __typename?: 'metal_flow_materials_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Metal_Flow_Materials_Variance_Fields = {
  __typename?: 'metal_flow_materials_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  shape?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "metal_flow.supplies" */
export type Metal_Flow_Supplies = {
  __typename?: 'metal_flow_supplies';
  id: Scalars['Int']['output'];
  /** An object relationship */
  material?: Maybe<Metal_Flow_Materials>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty: Scalars['numeric']['output'];
  supplied_at: Scalars['timestamp']['output'];
  supplier_name: Scalars['String']['output'];
};

/** aggregated selection of "metal_flow.supplies" */
export type Metal_Flow_Supplies_Aggregate = {
  __typename?: 'metal_flow_supplies_aggregate';
  aggregate?: Maybe<Metal_Flow_Supplies_Aggregate_Fields>;
  nodes: Array<Metal_Flow_Supplies>;
};

export type Metal_Flow_Supplies_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Flow_Supplies_Aggregate_Bool_Exp_Count>;
};

export type Metal_Flow_Supplies_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_flow.supplies" */
export type Metal_Flow_Supplies_Aggregate_Fields = {
  __typename?: 'metal_flow_supplies_aggregate_fields';
  avg?: Maybe<Metal_Flow_Supplies_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Flow_Supplies_Max_Fields>;
  min?: Maybe<Metal_Flow_Supplies_Min_Fields>;
  stddev?: Maybe<Metal_Flow_Supplies_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Flow_Supplies_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Flow_Supplies_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Flow_Supplies_Sum_Fields>;
  var_pop?: Maybe<Metal_Flow_Supplies_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Flow_Supplies_Var_Samp_Fields>;
  variance?: Maybe<Metal_Flow_Supplies_Variance_Fields>;
};


/** aggregate fields of "metal_flow.supplies" */
export type Metal_Flow_Supplies_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Flow_Supplies_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Flow_Supplies_Max_Order_By>;
  min?: InputMaybe<Metal_Flow_Supplies_Min_Order_By>;
  stddev?: InputMaybe<Metal_Flow_Supplies_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Flow_Supplies_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Flow_Supplies_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Flow_Supplies_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Flow_Supplies_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Flow_Supplies_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Flow_Supplies_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Arr_Rel_Insert_Input = {
  data: Array<Metal_Flow_Supplies_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Flow_Supplies_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Flow_Supplies_Avg_Fields = {
  __typename?: 'metal_flow_supplies_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_flow.supplies". All fields are combined with a logical 'AND'. */
export type Metal_Flow_Supplies_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Flow_Supplies_Bool_Exp>>;
  _not?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Flow_Supplies_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
  qty?: InputMaybe<Numeric_Comparison_Exp>;
  supplied_at?: InputMaybe<Timestamp_Comparison_Exp>;
  supplier_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_flow.supplies" */
export enum Metal_Flow_Supplies_Constraint {
  /** unique or primary key constraint on columns "id" */
  SuppliesPkey = 'supplies_pkey'
}

/** input type for incrementing numeric columns in table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Flow_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Metal_Flow_Supplies_Max_Fields = {
  __typename?: 'metal_flow_supplies_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  supplied_at?: Maybe<Scalars['timestamp']['output']>;
  supplier_name?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Flow_Supplies_Min_Fields = {
  __typename?: 'metal_flow_supplies_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  supplied_at?: Maybe<Scalars['timestamp']['output']>;
  supplier_name?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Mutation_Response = {
  __typename?: 'metal_flow_supplies_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Flow_Supplies>;
};

/** on_conflict condition type for table "metal_flow.supplies" */
export type Metal_Flow_Supplies_On_Conflict = {
  constraint: Metal_Flow_Supplies_Constraint;
  update_columns?: Array<Metal_Flow_Supplies_Update_Column>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_flow.supplies". */
export type Metal_Flow_Supplies_Order_By = {
  id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Flow_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  supplied_at?: InputMaybe<Order_By>;
  supplier_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_flow.supplies */
export type Metal_Flow_Supplies_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "metal_flow.supplies" */
export enum Metal_Flow_Supplies_Select_Column {
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

/** input type for updating data in table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Flow_Supplies_Stddev_Fields = {
  __typename?: 'metal_flow_supplies_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Flow_Supplies_Stddev_Pop_Fields = {
  __typename?: 'metal_flow_supplies_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Flow_Supplies_Stddev_Samp_Fields = {
  __typename?: 'metal_flow_supplies_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_flow_supplies" */
export type Metal_Flow_Supplies_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Flow_Supplies_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Flow_Supplies_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  supplied_at?: InputMaybe<Scalars['timestamp']['input']>;
  supplier_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Metal_Flow_Supplies_Sum_Fields = {
  __typename?: 'metal_flow_supplies_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** update columns of table "metal_flow.supplies" */
export enum Metal_Flow_Supplies_Update_Column {
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

export type Metal_Flow_Supplies_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Flow_Supplies_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Flow_Supplies_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Flow_Supplies_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Flow_Supplies_Var_Pop_Fields = {
  __typename?: 'metal_flow_supplies_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Flow_Supplies_Var_Samp_Fields = {
  __typename?: 'metal_flow_supplies_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Flow_Supplies_Variance_Fields = {
  __typename?: 'metal_flow_supplies_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_flow.supplies" */
export type Metal_Flow_Supplies_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
};

/** columns and relationships of "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs = {
  __typename?: 'metal_flow_writeoffs';
  date: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  material: Metal_Flow_Materials;
  material_id: Scalars['Int']['output'];
  qty: Scalars['numeric']['output'];
  reason: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  type_data: Scalars['jsonb']['output'];
};


/** columns and relationships of "metal_flow.writeoffs" */
export type Metal_Flow_WriteoffsType_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Aggregate = {
  __typename?: 'metal_flow_writeoffs_aggregate';
  aggregate?: Maybe<Metal_Flow_Writeoffs_Aggregate_Fields>;
  nodes: Array<Metal_Flow_Writeoffs>;
};

export type Metal_Flow_Writeoffs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Metal_Flow_Writeoffs_Aggregate_Bool_Exp_Count>;
};

export type Metal_Flow_Writeoffs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Aggregate_Fields = {
  __typename?: 'metal_flow_writeoffs_aggregate_fields';
  avg?: Maybe<Metal_Flow_Writeoffs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Metal_Flow_Writeoffs_Max_Fields>;
  min?: Maybe<Metal_Flow_Writeoffs_Min_Fields>;
  stddev?: Maybe<Metal_Flow_Writeoffs_Stddev_Fields>;
  stddev_pop?: Maybe<Metal_Flow_Writeoffs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metal_Flow_Writeoffs_Stddev_Samp_Fields>;
  sum?: Maybe<Metal_Flow_Writeoffs_Sum_Fields>;
  var_pop?: Maybe<Metal_Flow_Writeoffs_Var_Pop_Fields>;
  var_samp?: Maybe<Metal_Flow_Writeoffs_Var_Samp_Fields>;
  variance?: Maybe<Metal_Flow_Writeoffs_Variance_Fields>;
};


/** aggregate fields of "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Aggregate_Order_By = {
  avg?: InputMaybe<Metal_Flow_Writeoffs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metal_Flow_Writeoffs_Max_Order_By>;
  min?: InputMaybe<Metal_Flow_Writeoffs_Min_Order_By>;
  stddev?: InputMaybe<Metal_Flow_Writeoffs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metal_Flow_Writeoffs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metal_Flow_Writeoffs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metal_Flow_Writeoffs_Sum_Order_By>;
  var_pop?: InputMaybe<Metal_Flow_Writeoffs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metal_Flow_Writeoffs_Var_Samp_Order_By>;
  variance?: InputMaybe<Metal_Flow_Writeoffs_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Writeoffs_Append_Input = {
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Arr_Rel_Insert_Input = {
  data: Array<Metal_Flow_Writeoffs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metal_Flow_Writeoffs_On_Conflict>;
};

/** aggregate avg on columns */
export type Metal_Flow_Writeoffs_Avg_Fields = {
  __typename?: 'metal_flow_writeoffs_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metal_flow.writeoffs". All fields are combined with a logical 'AND'. */
export type Metal_Flow_Writeoffs_Bool_Exp = {
  _and?: InputMaybe<Array<Metal_Flow_Writeoffs_Bool_Exp>>;
  _not?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
  _or?: InputMaybe<Array<Metal_Flow_Writeoffs_Bool_Exp>>;
  date?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  material?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
  material_id?: InputMaybe<Int_Comparison_Exp>;
  qty?: InputMaybe<Numeric_Comparison_Exp>;
  reason?: InputMaybe<Int_Comparison_Exp>;
  type?: InputMaybe<Int_Comparison_Exp>;
  type_data?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "metal_flow.writeoffs" */
export enum Metal_Flow_Writeoffs_Constraint {
  /** unique or primary key constraint on columns "id" */
  WriteoffsPkey = 'writeoffs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Metal_Flow_Writeoffs_Delete_At_Path_Input = {
  type_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Metal_Flow_Writeoffs_Delete_Elem_Input = {
  type_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Metal_Flow_Writeoffs_Delete_Key_Input = {
  type_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Insert_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material?: InputMaybe<Metal_Flow_Materials_Obj_Rel_Insert_Input>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Metal_Flow_Writeoffs_Max_Fields = {
  __typename?: 'metal_flow_writeoffs_max_fields';
  date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Max_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metal_Flow_Writeoffs_Min_Fields = {
  __typename?: 'metal_flow_writeoffs_min_fields';
  date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Min_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Mutation_Response = {
  __typename?: 'metal_flow_writeoffs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Metal_Flow_Writeoffs>;
};

/** on_conflict condition type for table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_On_Conflict = {
  constraint: Metal_Flow_Writeoffs_Constraint;
  update_columns?: Array<Metal_Flow_Writeoffs_Update_Column>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};

/** Ordering options when selecting data from "metal_flow.writeoffs". */
export type Metal_Flow_Writeoffs_Order_By = {
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  material?: InputMaybe<Metal_Flow_Materials_Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  type_data?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metal_flow.writeoffs */
export type Metal_Flow_Writeoffs_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Metal_Flow_Writeoffs_Prepend_Input = {
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "metal_flow.writeoffs" */
export enum Metal_Flow_Writeoffs_Select_Column {
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

/** input type for updating data in table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Set_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate stddev on columns */
export type Metal_Flow_Writeoffs_Stddev_Fields = {
  __typename?: 'metal_flow_writeoffs_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metal_Flow_Writeoffs_Stddev_Pop_Fields = {
  __typename?: 'metal_flow_writeoffs_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metal_Flow_Writeoffs_Stddev_Samp_Fields = {
  __typename?: 'metal_flow_writeoffs_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "metal_flow_writeoffs" */
export type Metal_Flow_Writeoffs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metal_Flow_Writeoffs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metal_Flow_Writeoffs_Stream_Cursor_Value_Input = {
  date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  material_id?: InputMaybe<Scalars['Int']['input']>;
  qty?: InputMaybe<Scalars['numeric']['input']>;
  reason?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Metal_Flow_Writeoffs_Sum_Fields = {
  __typename?: 'metal_flow_writeoffs_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  material_id?: Maybe<Scalars['Int']['output']>;
  qty?: Maybe<Scalars['numeric']['output']>;
  reason?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** update columns of table "metal_flow.writeoffs" */
export enum Metal_Flow_Writeoffs_Update_Column {
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

export type Metal_Flow_Writeoffs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Metal_Flow_Writeoffs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Metal_Flow_Writeoffs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Metal_Flow_Writeoffs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Metal_Flow_Writeoffs_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Metal_Flow_Writeoffs_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Metal_Flow_Writeoffs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Metal_Flow_Writeoffs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Metal_Flow_Writeoffs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Metal_Flow_Writeoffs_Var_Pop_Fields = {
  __typename?: 'metal_flow_writeoffs_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metal_Flow_Writeoffs_Var_Samp_Fields = {
  __typename?: 'metal_flow_writeoffs_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  material_id?: InputMaybe<Order_By>;
  qty?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metal_Flow_Writeoffs_Variance_Fields = {
  __typename?: 'metal_flow_writeoffs_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  material_id?: Maybe<Scalars['Float']['output']>;
  qty?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "metal_flow.writeoffs" */
export type Metal_Flow_Writeoffs_Variance_Order_By = {
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
  /** delete data from the table: "kysely_migration" */
  delete_kysely_migration?: Maybe<Kysely_Migration_Mutation_Response>;
  /** delete single row from the table: "kysely_migration" */
  delete_kysely_migration_by_pk?: Maybe<Kysely_Migration>;
  /** delete data from the table: "kysely_migration_lock" */
  delete_kysely_migration_lock?: Maybe<Kysely_Migration_Lock_Mutation_Response>;
  /** delete single row from the table: "kysely_migration_lock" */
  delete_kysely_migration_lock_by_pk?: Maybe<Kysely_Migration_Lock>;
  /** delete data from the table: "metal_flow.detail_materials" */
  delete_metal_flow_detail_materials?: Maybe<Metal_Flow_Detail_Materials_Mutation_Response>;
  /** delete single row from the table: "metal_flow.detail_materials" */
  delete_metal_flow_detail_materials_by_pk?: Maybe<Metal_Flow_Detail_Materials>;
  /** delete data from the table: "metal_flow.details" */
  delete_metal_flow_details?: Maybe<Metal_Flow_Details_Mutation_Response>;
  /** delete single row from the table: "metal_flow.details" */
  delete_metal_flow_details_by_pk?: Maybe<Metal_Flow_Details>;
  /** delete data from the table: "metal_flow.materials" */
  delete_metal_flow_materials?: Maybe<Metal_Flow_Materials_Mutation_Response>;
  /** delete single row from the table: "metal_flow.materials" */
  delete_metal_flow_materials_by_pk?: Maybe<Metal_Flow_Materials>;
  /** delete data from the table: "metal_flow.supplies" */
  delete_metal_flow_supplies?: Maybe<Metal_Flow_Supplies_Mutation_Response>;
  /** delete single row from the table: "metal_flow.supplies" */
  delete_metal_flow_supplies_by_pk?: Maybe<Metal_Flow_Supplies>;
  /** delete data from the table: "metal_flow.writeoffs" */
  delete_metal_flow_writeoffs?: Maybe<Metal_Flow_Writeoffs_Mutation_Response>;
  /** delete single row from the table: "metal_flow.writeoffs" */
  delete_metal_flow_writeoffs_by_pk?: Maybe<Metal_Flow_Writeoffs>;
  /** delete data from the table: "orders.attachments" */
  delete_orders_attachments?: Maybe<Orders_Attachments_Mutation_Response>;
  /** delete single row from the table: "orders.attachments" */
  delete_orders_attachments_by_pk?: Maybe<Orders_Attachments>;
  /** delete data from the table: "orders.comments" */
  delete_orders_comments?: Maybe<Orders_Comments_Mutation_Response>;
  /** delete single row from the table: "orders.comments" */
  delete_orders_comments_by_pk?: Maybe<Orders_Comments>;
  /** delete data from the table: "orders.notifications" */
  delete_orders_notifications?: Maybe<Orders_Notifications_Mutation_Response>;
  /** delete single row from the table: "orders.notifications" */
  delete_orders_notifications_by_pk?: Maybe<Orders_Notifications>;
  /** delete data from the table: "orders.order_items" */
  delete_orders_order_items?: Maybe<Orders_Order_Items_Mutation_Response>;
  /** delete single row from the table: "orders.order_items" */
  delete_orders_order_items_by_pk?: Maybe<Orders_Order_Items>;
  /** delete data from the table: "orders.order_payments" */
  delete_orders_order_payments?: Maybe<Orders_Order_Payments_Mutation_Response>;
  /** delete single row from the table: "orders.order_payments" */
  delete_orders_order_payments_by_pk?: Maybe<Orders_Order_Payments>;
  /** delete data from the table: "orders.orders" */
  delete_orders_orders?: Maybe<Orders_Orders_Mutation_Response>;
  /** delete single row from the table: "orders.orders" */
  delete_orders_orders_by_pk?: Maybe<Orders_Orders>;
  /** delete data from the table: "refresh_tokens" */
  delete_refresh_tokens?: Maybe<Refresh_Tokens_Mutation_Response>;
  /** delete single row from the table: "refresh_tokens" */
  delete_refresh_tokens_by_pk?: Maybe<Refresh_Tokens>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
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
  /** insert data into the table: "kysely_migration" */
  insert_kysely_migration?: Maybe<Kysely_Migration_Mutation_Response>;
  /** insert data into the table: "kysely_migration_lock" */
  insert_kysely_migration_lock?: Maybe<Kysely_Migration_Lock_Mutation_Response>;
  /** insert a single row into the table: "kysely_migration_lock" */
  insert_kysely_migration_lock_one?: Maybe<Kysely_Migration_Lock>;
  /** insert a single row into the table: "kysely_migration" */
  insert_kysely_migration_one?: Maybe<Kysely_Migration>;
  /** insert data into the table: "metal_flow.detail_materials" */
  insert_metal_flow_detail_materials?: Maybe<Metal_Flow_Detail_Materials_Mutation_Response>;
  /** insert a single row into the table: "metal_flow.detail_materials" */
  insert_metal_flow_detail_materials_one?: Maybe<Metal_Flow_Detail_Materials>;
  /** insert data into the table: "metal_flow.details" */
  insert_metal_flow_details?: Maybe<Metal_Flow_Details_Mutation_Response>;
  /** insert a single row into the table: "metal_flow.details" */
  insert_metal_flow_details_one?: Maybe<Metal_Flow_Details>;
  /** insert data into the table: "metal_flow.materials" */
  insert_metal_flow_materials?: Maybe<Metal_Flow_Materials_Mutation_Response>;
  /** insert a single row into the table: "metal_flow.materials" */
  insert_metal_flow_materials_one?: Maybe<Metal_Flow_Materials>;
  /** insert data into the table: "metal_flow.supplies" */
  insert_metal_flow_supplies?: Maybe<Metal_Flow_Supplies_Mutation_Response>;
  /** insert a single row into the table: "metal_flow.supplies" */
  insert_metal_flow_supplies_one?: Maybe<Metal_Flow_Supplies>;
  /** insert data into the table: "metal_flow.writeoffs" */
  insert_metal_flow_writeoffs?: Maybe<Metal_Flow_Writeoffs_Mutation_Response>;
  /** insert a single row into the table: "metal_flow.writeoffs" */
  insert_metal_flow_writeoffs_one?: Maybe<Metal_Flow_Writeoffs>;
  /** insert data into the table: "orders.attachments" */
  insert_orders_attachments?: Maybe<Orders_Attachments_Mutation_Response>;
  /** insert a single row into the table: "orders.attachments" */
  insert_orders_attachments_one?: Maybe<Orders_Attachments>;
  /** insert data into the table: "orders.comments" */
  insert_orders_comments?: Maybe<Orders_Comments_Mutation_Response>;
  /** insert a single row into the table: "orders.comments" */
  insert_orders_comments_one?: Maybe<Orders_Comments>;
  /** insert data into the table: "orders.notifications" */
  insert_orders_notifications?: Maybe<Orders_Notifications_Mutation_Response>;
  /** insert a single row into the table: "orders.notifications" */
  insert_orders_notifications_one?: Maybe<Orders_Notifications>;
  /** insert data into the table: "orders.order_items" */
  insert_orders_order_items?: Maybe<Orders_Order_Items_Mutation_Response>;
  /** insert a single row into the table: "orders.order_items" */
  insert_orders_order_items_one?: Maybe<Orders_Order_Items>;
  /** insert data into the table: "orders.order_payments" */
  insert_orders_order_payments?: Maybe<Orders_Order_Payments_Mutation_Response>;
  /** insert a single row into the table: "orders.order_payments" */
  insert_orders_order_payments_one?: Maybe<Orders_Order_Payments>;
  /** insert data into the table: "orders.orders" */
  insert_orders_orders?: Maybe<Orders_Orders_Mutation_Response>;
  /** insert a single row into the table: "orders.orders" */
  insert_orders_orders_one?: Maybe<Orders_Orders>;
  /** insert data into the table: "refresh_tokens" */
  insert_refresh_tokens?: Maybe<Refresh_Tokens_Mutation_Response>;
  /** insert a single row into the table: "refresh_tokens" */
  insert_refresh_tokens_one?: Maybe<Refresh_Tokens>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
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
  /** update data of the table: "metal_flow.detail_materials" */
  update_metal_flow_detail_materials?: Maybe<Metal_Flow_Detail_Materials_Mutation_Response>;
  /** update single row of the table: "metal_flow.detail_materials" */
  update_metal_flow_detail_materials_by_pk?: Maybe<Metal_Flow_Detail_Materials>;
  /** update multiples rows of table: "metal_flow.detail_materials" */
  update_metal_flow_detail_materials_many?: Maybe<Array<Maybe<Metal_Flow_Detail_Materials_Mutation_Response>>>;
  /** update data of the table: "metal_flow.details" */
  update_metal_flow_details?: Maybe<Metal_Flow_Details_Mutation_Response>;
  /** update single row of the table: "metal_flow.details" */
  update_metal_flow_details_by_pk?: Maybe<Metal_Flow_Details>;
  /** update multiples rows of table: "metal_flow.details" */
  update_metal_flow_details_many?: Maybe<Array<Maybe<Metal_Flow_Details_Mutation_Response>>>;
  /** update data of the table: "metal_flow.materials" */
  update_metal_flow_materials?: Maybe<Metal_Flow_Materials_Mutation_Response>;
  /** update single row of the table: "metal_flow.materials" */
  update_metal_flow_materials_by_pk?: Maybe<Metal_Flow_Materials>;
  /** update multiples rows of table: "metal_flow.materials" */
  update_metal_flow_materials_many?: Maybe<Array<Maybe<Metal_Flow_Materials_Mutation_Response>>>;
  /** update data of the table: "metal_flow.supplies" */
  update_metal_flow_supplies?: Maybe<Metal_Flow_Supplies_Mutation_Response>;
  /** update single row of the table: "metal_flow.supplies" */
  update_metal_flow_supplies_by_pk?: Maybe<Metal_Flow_Supplies>;
  /** update multiples rows of table: "metal_flow.supplies" */
  update_metal_flow_supplies_many?: Maybe<Array<Maybe<Metal_Flow_Supplies_Mutation_Response>>>;
  /** update data of the table: "metal_flow.writeoffs" */
  update_metal_flow_writeoffs?: Maybe<Metal_Flow_Writeoffs_Mutation_Response>;
  /** update single row of the table: "metal_flow.writeoffs" */
  update_metal_flow_writeoffs_by_pk?: Maybe<Metal_Flow_Writeoffs>;
  /** update multiples rows of table: "metal_flow.writeoffs" */
  update_metal_flow_writeoffs_many?: Maybe<Array<Maybe<Metal_Flow_Writeoffs_Mutation_Response>>>;
  /** update data of the table: "orders.attachments" */
  update_orders_attachments?: Maybe<Orders_Attachments_Mutation_Response>;
  /** update single row of the table: "orders.attachments" */
  update_orders_attachments_by_pk?: Maybe<Orders_Attachments>;
  /** update multiples rows of table: "orders.attachments" */
  update_orders_attachments_many?: Maybe<Array<Maybe<Orders_Attachments_Mutation_Response>>>;
  /** update data of the table: "orders.comments" */
  update_orders_comments?: Maybe<Orders_Comments_Mutation_Response>;
  /** update single row of the table: "orders.comments" */
  update_orders_comments_by_pk?: Maybe<Orders_Comments>;
  /** update multiples rows of table: "orders.comments" */
  update_orders_comments_many?: Maybe<Array<Maybe<Orders_Comments_Mutation_Response>>>;
  /** update data of the table: "orders.notifications" */
  update_orders_notifications?: Maybe<Orders_Notifications_Mutation_Response>;
  /** update single row of the table: "orders.notifications" */
  update_orders_notifications_by_pk?: Maybe<Orders_Notifications>;
  /** update multiples rows of table: "orders.notifications" */
  update_orders_notifications_many?: Maybe<Array<Maybe<Orders_Notifications_Mutation_Response>>>;
  /** update data of the table: "orders.order_items" */
  update_orders_order_items?: Maybe<Orders_Order_Items_Mutation_Response>;
  /** update single row of the table: "orders.order_items" */
  update_orders_order_items_by_pk?: Maybe<Orders_Order_Items>;
  /** update multiples rows of table: "orders.order_items" */
  update_orders_order_items_many?: Maybe<Array<Maybe<Orders_Order_Items_Mutation_Response>>>;
  /** update data of the table: "orders.order_payments" */
  update_orders_order_payments?: Maybe<Orders_Order_Payments_Mutation_Response>;
  /** update single row of the table: "orders.order_payments" */
  update_orders_order_payments_by_pk?: Maybe<Orders_Order_Payments>;
  /** update multiples rows of table: "orders.order_payments" */
  update_orders_order_payments_many?: Maybe<Array<Maybe<Orders_Order_Payments_Mutation_Response>>>;
  /** update data of the table: "orders.orders" */
  update_orders_orders?: Maybe<Orders_Orders_Mutation_Response>;
  /** update single row of the table: "orders.orders" */
  update_orders_orders_by_pk?: Maybe<Orders_Orders>;
  /** update multiples rows of table: "orders.orders" */
  update_orders_orders_many?: Maybe<Array<Maybe<Orders_Orders_Mutation_Response>>>;
  /** update data of the table: "refresh_tokens" */
  update_refresh_tokens?: Maybe<Refresh_Tokens_Mutation_Response>;
  /** update single row of the table: "refresh_tokens" */
  update_refresh_tokens_by_pk?: Maybe<Refresh_Tokens>;
  /** update multiples rows of table: "refresh_tokens" */
  update_refresh_tokens_many?: Maybe<Array<Maybe<Refresh_Tokens_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
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
export type Mutation_RootDelete_Metal_Flow_Detail_MaterialsArgs = {
  where: Metal_Flow_Detail_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_DetailsArgs = {
  where: Metal_Flow_Details_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_MaterialsArgs = {
  where: Metal_Flow_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_SuppliesArgs = {
  where: Metal_Flow_Supplies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_WriteoffsArgs = {
  where: Metal_Flow_Writeoffs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metal_Flow_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_AttachmentsArgs = {
  where: Orders_Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Attachments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_CommentsArgs = {
  where: Orders_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Comments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_NotificationsArgs = {
  where: Orders_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Notifications_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_Order_ItemsArgs = {
  where: Orders_Order_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Order_Items_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_Order_PaymentsArgs = {
  where: Orders_Order_Payments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Order_Payments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Orders_OrdersArgs = {
  where: Orders_Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_Orders_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Refresh_TokensArgs = {
  where: Refresh_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Refresh_Tokens_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
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
export type Mutation_RootInsert_Metal_Flow_Detail_MaterialsArgs = {
  objects: Array<Metal_Flow_Detail_Materials_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Flow_Detail_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_Detail_Materials_OneArgs = {
  object: Metal_Flow_Detail_Materials_Insert_Input;
  on_conflict?: InputMaybe<Metal_Flow_Detail_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_DetailsArgs = {
  objects: Array<Metal_Flow_Details_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Flow_Details_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_Details_OneArgs = {
  object: Metal_Flow_Details_Insert_Input;
  on_conflict?: InputMaybe<Metal_Flow_Details_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_MaterialsArgs = {
  objects: Array<Metal_Flow_Materials_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Flow_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_Materials_OneArgs = {
  object: Metal_Flow_Materials_Insert_Input;
  on_conflict?: InputMaybe<Metal_Flow_Materials_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_SuppliesArgs = {
  objects: Array<Metal_Flow_Supplies_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Flow_Supplies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_Supplies_OneArgs = {
  object: Metal_Flow_Supplies_Insert_Input;
  on_conflict?: InputMaybe<Metal_Flow_Supplies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_WriteoffsArgs = {
  objects: Array<Metal_Flow_Writeoffs_Insert_Input>;
  on_conflict?: InputMaybe<Metal_Flow_Writeoffs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metal_Flow_Writeoffs_OneArgs = {
  object: Metal_Flow_Writeoffs_Insert_Input;
  on_conflict?: InputMaybe<Metal_Flow_Writeoffs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_AttachmentsArgs = {
  objects: Array<Orders_Attachments_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Attachments_OneArgs = {
  object: Orders_Attachments_Insert_Input;
  on_conflict?: InputMaybe<Orders_Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_CommentsArgs = {
  objects: Array<Orders_Comments_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Comments_OneArgs = {
  object: Orders_Comments_Insert_Input;
  on_conflict?: InputMaybe<Orders_Comments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_NotificationsArgs = {
  objects: Array<Orders_Notifications_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Notifications_OneArgs = {
  object: Orders_Notifications_Insert_Input;
  on_conflict?: InputMaybe<Orders_Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Order_ItemsArgs = {
  objects: Array<Orders_Order_Items_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Order_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Order_Items_OneArgs = {
  object: Orders_Order_Items_Insert_Input;
  on_conflict?: InputMaybe<Orders_Order_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Order_PaymentsArgs = {
  objects: Array<Orders_Order_Payments_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Order_Payments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Order_Payments_OneArgs = {
  object: Orders_Order_Payments_Insert_Input;
  on_conflict?: InputMaybe<Orders_Order_Payments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_OrdersArgs = {
  objects: Array<Orders_Orders_Insert_Input>;
  on_conflict?: InputMaybe<Orders_Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_Orders_OneArgs = {
  object: Orders_Orders_Insert_Input;
  on_conflict?: InputMaybe<Orders_Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Refresh_TokensArgs = {
  objects: Array<Refresh_Tokens_Insert_Input>;
  on_conflict?: InputMaybe<Refresh_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Refresh_Tokens_OneArgs = {
  object: Refresh_Tokens_Insert_Input;
  on_conflict?: InputMaybe<Refresh_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
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
export type Mutation_RootUpdate_Metal_Flow_Detail_MaterialsArgs = {
  _append?: InputMaybe<Metal_Flow_Detail_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Detail_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Detail_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Detail_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Detail_Materials_Set_Input>;
  where: Metal_Flow_Detail_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Detail_Materials_By_PkArgs = {
  _append?: InputMaybe<Metal_Flow_Detail_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Detail_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Detail_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Detail_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Detail_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Detail_Materials_Set_Input>;
  pk_columns: Metal_Flow_Detail_Materials_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Detail_Materials_ManyArgs = {
  updates: Array<Metal_Flow_Detail_Materials_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_DetailsArgs = {
  _inc?: InputMaybe<Metal_Flow_Details_Inc_Input>;
  _set?: InputMaybe<Metal_Flow_Details_Set_Input>;
  where: Metal_Flow_Details_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Details_By_PkArgs = {
  _inc?: InputMaybe<Metal_Flow_Details_Inc_Input>;
  _set?: InputMaybe<Metal_Flow_Details_Set_Input>;
  pk_columns: Metal_Flow_Details_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Details_ManyArgs = {
  updates: Array<Metal_Flow_Details_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_MaterialsArgs = {
  _append?: InputMaybe<Metal_Flow_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Materials_Set_Input>;
  where: Metal_Flow_Materials_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Materials_By_PkArgs = {
  _append?: InputMaybe<Metal_Flow_Materials_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Materials_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Materials_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Materials_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Materials_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Materials_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Materials_Set_Input>;
  pk_columns: Metal_Flow_Materials_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Materials_ManyArgs = {
  updates: Array<Metal_Flow_Materials_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_SuppliesArgs = {
  _inc?: InputMaybe<Metal_Flow_Supplies_Inc_Input>;
  _set?: InputMaybe<Metal_Flow_Supplies_Set_Input>;
  where: Metal_Flow_Supplies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Supplies_By_PkArgs = {
  _inc?: InputMaybe<Metal_Flow_Supplies_Inc_Input>;
  _set?: InputMaybe<Metal_Flow_Supplies_Set_Input>;
  pk_columns: Metal_Flow_Supplies_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Supplies_ManyArgs = {
  updates: Array<Metal_Flow_Supplies_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_WriteoffsArgs = {
  _append?: InputMaybe<Metal_Flow_Writeoffs_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Writeoffs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Writeoffs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Writeoffs_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Writeoffs_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Writeoffs_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Writeoffs_Set_Input>;
  where: Metal_Flow_Writeoffs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Writeoffs_By_PkArgs = {
  _append?: InputMaybe<Metal_Flow_Writeoffs_Append_Input>;
  _delete_at_path?: InputMaybe<Metal_Flow_Writeoffs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Metal_Flow_Writeoffs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Metal_Flow_Writeoffs_Delete_Key_Input>;
  _inc?: InputMaybe<Metal_Flow_Writeoffs_Inc_Input>;
  _prepend?: InputMaybe<Metal_Flow_Writeoffs_Prepend_Input>;
  _set?: InputMaybe<Metal_Flow_Writeoffs_Set_Input>;
  pk_columns: Metal_Flow_Writeoffs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Metal_Flow_Writeoffs_ManyArgs = {
  updates: Array<Metal_Flow_Writeoffs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_AttachmentsArgs = {
  _inc?: InputMaybe<Orders_Attachments_Inc_Input>;
  _set?: InputMaybe<Orders_Attachments_Set_Input>;
  where: Orders_Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Attachments_By_PkArgs = {
  _inc?: InputMaybe<Orders_Attachments_Inc_Input>;
  _set?: InputMaybe<Orders_Attachments_Set_Input>;
  pk_columns: Orders_Attachments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Attachments_ManyArgs = {
  updates: Array<Orders_Attachments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_CommentsArgs = {
  _inc?: InputMaybe<Orders_Comments_Inc_Input>;
  _set?: InputMaybe<Orders_Comments_Set_Input>;
  where: Orders_Comments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Comments_By_PkArgs = {
  _inc?: InputMaybe<Orders_Comments_Inc_Input>;
  _set?: InputMaybe<Orders_Comments_Set_Input>;
  pk_columns: Orders_Comments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Comments_ManyArgs = {
  updates: Array<Orders_Comments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_NotificationsArgs = {
  _inc?: InputMaybe<Orders_Notifications_Inc_Input>;
  _set?: InputMaybe<Orders_Notifications_Set_Input>;
  where: Orders_Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Notifications_By_PkArgs = {
  _inc?: InputMaybe<Orders_Notifications_Inc_Input>;
  _set?: InputMaybe<Orders_Notifications_Set_Input>;
  pk_columns: Orders_Notifications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Notifications_ManyArgs = {
  updates: Array<Orders_Notifications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_ItemsArgs = {
  _inc?: InputMaybe<Orders_Order_Items_Inc_Input>;
  _set?: InputMaybe<Orders_Order_Items_Set_Input>;
  where: Orders_Order_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_Items_By_PkArgs = {
  _inc?: InputMaybe<Orders_Order_Items_Inc_Input>;
  _set?: InputMaybe<Orders_Order_Items_Set_Input>;
  pk_columns: Orders_Order_Items_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_Items_ManyArgs = {
  updates: Array<Orders_Order_Items_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_PaymentsArgs = {
  _inc?: InputMaybe<Orders_Order_Payments_Inc_Input>;
  _set?: InputMaybe<Orders_Order_Payments_Set_Input>;
  where: Orders_Order_Payments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_Payments_By_PkArgs = {
  _inc?: InputMaybe<Orders_Order_Payments_Inc_Input>;
  _set?: InputMaybe<Orders_Order_Payments_Set_Input>;
  pk_columns: Orders_Order_Payments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Order_Payments_ManyArgs = {
  updates: Array<Orders_Order_Payments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_OrdersArgs = {
  _inc?: InputMaybe<Orders_Orders_Inc_Input>;
  _set?: InputMaybe<Orders_Orders_Set_Input>;
  where: Orders_Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Orders_By_PkArgs = {
  _inc?: InputMaybe<Orders_Orders_Inc_Input>;
  _set?: InputMaybe<Orders_Orders_Set_Input>;
  pk_columns: Orders_Orders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_Orders_ManyArgs = {
  updates: Array<Orders_Orders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Refresh_TokensArgs = {
  _inc?: InputMaybe<Refresh_Tokens_Inc_Input>;
  _set?: InputMaybe<Refresh_Tokens_Set_Input>;
  where: Refresh_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Refresh_Tokens_By_PkArgs = {
  _inc?: InputMaybe<Refresh_Tokens_Inc_Input>;
  _set?: InputMaybe<Refresh_Tokens_Set_Input>;
  pk_columns: Refresh_Tokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Refresh_Tokens_ManyArgs = {
  updates: Array<Refresh_Tokens_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
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

/** columns and relationships of "orders.attachments" */
export type Orders_Attachments = {
  __typename?: 'orders_attachments';
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  /** An object relationship */
  order: Orders_Orders;
  order_id: Scalars['Int']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  uploaded_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregated selection of "orders.attachments" */
export type Orders_Attachments_Aggregate = {
  __typename?: 'orders_attachments_aggregate';
  aggregate?: Maybe<Orders_Attachments_Aggregate_Fields>;
  nodes: Array<Orders_Attachments>;
};

export type Orders_Attachments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Orders_Attachments_Aggregate_Bool_Exp_Count>;
};

export type Orders_Attachments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Attachments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.attachments" */
export type Orders_Attachments_Aggregate_Fields = {
  __typename?: 'orders_attachments_aggregate_fields';
  avg?: Maybe<Orders_Attachments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Attachments_Max_Fields>;
  min?: Maybe<Orders_Attachments_Min_Fields>;
  stddev?: Maybe<Orders_Attachments_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Attachments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Attachments_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Attachments_Sum_Fields>;
  var_pop?: Maybe<Orders_Attachments_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Attachments_Var_Samp_Fields>;
  variance?: Maybe<Orders_Attachments_Variance_Fields>;
};


/** aggregate fields of "orders.attachments" */
export type Orders_Attachments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.attachments" */
export type Orders_Attachments_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Attachments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Attachments_Max_Order_By>;
  min?: InputMaybe<Orders_Attachments_Min_Order_By>;
  stddev?: InputMaybe<Orders_Attachments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Attachments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Attachments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Attachments_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Attachments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Attachments_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Attachments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.attachments" */
export type Orders_Attachments_Arr_Rel_Insert_Input = {
  data: Array<Orders_Attachments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Attachments_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Attachments_Avg_Fields = {
  __typename?: 'orders_attachments_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.attachments" */
export type Orders_Attachments_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.attachments". All fields are combined with a logical 'AND'. */
export type Orders_Attachments_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Attachments_Bool_Exp>>;
  _not?: InputMaybe<Orders_Attachments_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Attachments_Bool_Exp>>;
  filename?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  key?: InputMaybe<String_Comparison_Exp>;
  order?: InputMaybe<Orders_Orders_Bool_Exp>;
  order_id?: InputMaybe<Int_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  uploaded_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders.attachments" */
export enum Orders_Attachments_Constraint {
  /** unique or primary key constraint on columns "id" */
  DocsIdKey = 'Docs_ID_key',
  /** unique or primary key constraint on columns "key" */
  DocsKeyKey = 'Docs_Key_key',
  /** unique or primary key constraint on columns "id" */
  DocsPkey = 'Docs_pkey'
}

/** input type for incrementing numeric columns in table "orders.attachments" */
export type Orders_Attachments_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "orders.attachments" */
export type Orders_Attachments_Insert_Input = {
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Orders_Orders_Obj_Rel_Insert_Input>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Orders_Attachments_Max_Fields = {
  __typename?: 'orders_attachments_max_fields';
  filename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  uploaded_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "orders.attachments" */
export type Orders_Attachments_Max_Order_By = {
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  uploaded_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Attachments_Min_Fields = {
  __typename?: 'orders_attachments_min_fields';
  filename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  uploaded_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "orders.attachments" */
export type Orders_Attachments_Min_Order_By = {
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  uploaded_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.attachments" */
export type Orders_Attachments_Mutation_Response = {
  __typename?: 'orders_attachments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Attachments>;
};

/** on_conflict condition type for table "orders.attachments" */
export type Orders_Attachments_On_Conflict = {
  constraint: Orders_Attachments_Constraint;
  update_columns?: Array<Orders_Attachments_Update_Column>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.attachments". */
export type Orders_Attachments_Order_By = {
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  order?: InputMaybe<Orders_Orders_Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  uploaded_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders.attachments */
export type Orders_Attachments_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.attachments" */
export enum Orders_Attachments_Select_Column {
  /** column name */
  Filename = 'filename',
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Size = 'size',
  /** column name */
  UploadedAt = 'uploaded_at'
}

/** input type for updating data in table "orders.attachments" */
export type Orders_Attachments_Set_Input = {
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Attachments_Stddev_Fields = {
  __typename?: 'orders_attachments_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.attachments" */
export type Orders_Attachments_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Attachments_Stddev_Pop_Fields = {
  __typename?: 'orders_attachments_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.attachments" */
export type Orders_Attachments_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Attachments_Stddev_Samp_Fields = {
  __typename?: 'orders_attachments_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.attachments" */
export type Orders_Attachments_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_attachments" */
export type Orders_Attachments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Attachments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Attachments_Stream_Cursor_Value_Input = {
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Orders_Attachments_Sum_Fields = {
  __typename?: 'orders_attachments_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "orders.attachments" */
export type Orders_Attachments_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** update columns of table "orders.attachments" */
export enum Orders_Attachments_Update_Column {
  /** column name */
  Filename = 'filename',
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Size = 'size',
  /** column name */
  UploadedAt = 'uploaded_at'
}

export type Orders_Attachments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Attachments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Attachments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Attachments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Attachments_Var_Pop_Fields = {
  __typename?: 'orders_attachments_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.attachments" */
export type Orders_Attachments_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Attachments_Var_Samp_Fields = {
  __typename?: 'orders_attachments_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.attachments" */
export type Orders_Attachments_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Attachments_Variance_Fields = {
  __typename?: 'orders_attachments_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.attachments" */
export type Orders_Attachments_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
};

/** columns and relationships of "orders.comments" */
export type Orders_Comments = {
  __typename?: 'orders_comments';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  /** An array relationship */
  notifications: Array<Orders_Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Orders_Notifications_Aggregate;
  /** An object relationship */
  order: Orders_Orders;
  order_id: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['Int']['output'];
};


/** columns and relationships of "orders.comments" */
export type Orders_CommentsNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


/** columns and relationships of "orders.comments" */
export type Orders_CommentsNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};

/** aggregated selection of "orders.comments" */
export type Orders_Comments_Aggregate = {
  __typename?: 'orders_comments_aggregate';
  aggregate?: Maybe<Orders_Comments_Aggregate_Fields>;
  nodes: Array<Orders_Comments>;
};

export type Orders_Comments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Orders_Comments_Aggregate_Bool_Exp_Count>;
};

export type Orders_Comments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Comments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.comments" */
export type Orders_Comments_Aggregate_Fields = {
  __typename?: 'orders_comments_aggregate_fields';
  avg?: Maybe<Orders_Comments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Comments_Max_Fields>;
  min?: Maybe<Orders_Comments_Min_Fields>;
  stddev?: Maybe<Orders_Comments_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Comments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Comments_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Comments_Sum_Fields>;
  var_pop?: Maybe<Orders_Comments_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Comments_Var_Samp_Fields>;
  variance?: Maybe<Orders_Comments_Variance_Fields>;
};


/** aggregate fields of "orders.comments" */
export type Orders_Comments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.comments" */
export type Orders_Comments_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Comments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Comments_Max_Order_By>;
  min?: InputMaybe<Orders_Comments_Min_Order_By>;
  stddev?: InputMaybe<Orders_Comments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Comments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Comments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Comments_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Comments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Comments_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Comments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.comments" */
export type Orders_Comments_Arr_Rel_Insert_Input = {
  data: Array<Orders_Comments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Comments_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Comments_Avg_Fields = {
  __typename?: 'orders_comments_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.comments" */
export type Orders_Comments_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.comments". All fields are combined with a logical 'AND'. */
export type Orders_Comments_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Comments_Bool_Exp>>;
  _not?: InputMaybe<Orders_Comments_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Comments_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  notifications?: InputMaybe<Orders_Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp>;
  order?: InputMaybe<Orders_Orders_Bool_Exp>;
  order_id?: InputMaybe<Int_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders.comments" */
export enum Orders_Comments_Constraint {
  /** unique or primary key constraint on columns "id" */
  CommentsPkey = 'Comments_pkey'
}

/** input type for incrementing numeric columns in table "orders.comments" */
export type Orders_Comments_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "orders.comments" */
export type Orders_Comments_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  notifications?: InputMaybe<Orders_Notifications_Arr_Rel_Insert_Input>;
  order?: InputMaybe<Orders_Orders_Obj_Rel_Insert_Input>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Orders_Comments_Max_Fields = {
  __typename?: 'orders_comments_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "orders.comments" */
export type Orders_Comments_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Comments_Min_Fields = {
  __typename?: 'orders_comments_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "orders.comments" */
export type Orders_Comments_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.comments" */
export type Orders_Comments_Mutation_Response = {
  __typename?: 'orders_comments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Comments>;
};

/** input type for inserting object relation for remote table "orders.comments" */
export type Orders_Comments_Obj_Rel_Insert_Input = {
  data: Orders_Comments_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Comments_On_Conflict>;
};

/** on_conflict condition type for table "orders.comments" */
export type Orders_Comments_On_Conflict = {
  constraint: Orders_Comments_Constraint;
  update_columns?: Array<Orders_Comments_Update_Column>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.comments". */
export type Orders_Comments_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Order_By>;
  order?: InputMaybe<Orders_Orders_Order_By>;
  order_id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders.comments */
export type Orders_Comments_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.comments" */
export enum Orders_Comments_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Text = 'text',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "orders.comments" */
export type Orders_Comments_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Comments_Stddev_Fields = {
  __typename?: 'orders_comments_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.comments" */
export type Orders_Comments_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Comments_Stddev_Pop_Fields = {
  __typename?: 'orders_comments_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.comments" */
export type Orders_Comments_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Comments_Stddev_Samp_Fields = {
  __typename?: 'orders_comments_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.comments" */
export type Orders_Comments_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_comments" */
export type Orders_Comments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Comments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Comments_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Orders_Comments_Sum_Fields = {
  __typename?: 'orders_comments_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "orders.comments" */
export type Orders_Comments_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** update columns of table "orders.comments" */
export enum Orders_Comments_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Text = 'text',
  /** column name */
  UserId = 'user_id'
}

export type Orders_Comments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Comments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Comments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Comments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Comments_Var_Pop_Fields = {
  __typename?: 'orders_comments_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.comments" */
export type Orders_Comments_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Comments_Var_Samp_Fields = {
  __typename?: 'orders_comments_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.comments" */
export type Orders_Comments_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Comments_Variance_Fields = {
  __typename?: 'orders_comments_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.comments" */
export type Orders_Comments_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "orders.notifications" */
export type Orders_Notifications = {
  __typename?: 'orders_notifications';
  /** An object relationship */
  comment: Orders_Comments;
  comment_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  order?: Maybe<Orders_Orders>;
  order_id?: Maybe<Scalars['Int']['output']>;
  seen: Scalars['Boolean']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "orders.notifications" */
export type Orders_Notifications_Aggregate = {
  __typename?: 'orders_notifications_aggregate';
  aggregate?: Maybe<Orders_Notifications_Aggregate_Fields>;
  nodes: Array<Orders_Notifications>;
};

export type Orders_Notifications_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp_Count>;
};

export type Orders_Notifications_Aggregate_Bool_Exp_Bool_And = {
  arguments: Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Notifications_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Notifications_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Notifications_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Notifications_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Notifications_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.notifications" */
export type Orders_Notifications_Aggregate_Fields = {
  __typename?: 'orders_notifications_aggregate_fields';
  avg?: Maybe<Orders_Notifications_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Notifications_Max_Fields>;
  min?: Maybe<Orders_Notifications_Min_Fields>;
  stddev?: Maybe<Orders_Notifications_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Notifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Notifications_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Notifications_Sum_Fields>;
  var_pop?: Maybe<Orders_Notifications_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Notifications_Var_Samp_Fields>;
  variance?: Maybe<Orders_Notifications_Variance_Fields>;
};


/** aggregate fields of "orders.notifications" */
export type Orders_Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.notifications" */
export type Orders_Notifications_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Notifications_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Notifications_Max_Order_By>;
  min?: InputMaybe<Orders_Notifications_Min_Order_By>;
  stddev?: InputMaybe<Orders_Notifications_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Notifications_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Notifications_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Notifications_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Notifications_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Notifications_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Notifications_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.notifications" */
export type Orders_Notifications_Arr_Rel_Insert_Input = {
  data: Array<Orders_Notifications_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Notifications_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Notifications_Avg_Fields = {
  __typename?: 'orders_notifications_avg_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.notifications" */
export type Orders_Notifications_Avg_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.notifications". All fields are combined with a logical 'AND'. */
export type Orders_Notifications_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Notifications_Bool_Exp>>;
  _not?: InputMaybe<Orders_Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Notifications_Bool_Exp>>;
  comment?: InputMaybe<Orders_Comments_Bool_Exp>;
  comment_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  order?: InputMaybe<Orders_Orders_Bool_Exp>;
  order_id?: InputMaybe<Int_Comparison_Exp>;
  seen?: InputMaybe<Boolean_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders.notifications" */
export enum Orders_Notifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationsPkey = 'Notifications_pkey'
}

/** input type for incrementing numeric columns in table "orders.notifications" */
export type Orders_Notifications_Inc_Input = {
  comment_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "orders.notifications" */
export type Orders_Notifications_Insert_Input = {
  comment?: InputMaybe<Orders_Comments_Obj_Rel_Insert_Input>;
  comment_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Orders_Orders_Obj_Rel_Insert_Input>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  seen?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Orders_Notifications_Max_Fields = {
  __typename?: 'orders_notifications_max_fields';
  comment_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "orders.notifications" */
export type Orders_Notifications_Max_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Notifications_Min_Fields = {
  __typename?: 'orders_notifications_min_fields';
  comment_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "orders.notifications" */
export type Orders_Notifications_Min_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.notifications" */
export type Orders_Notifications_Mutation_Response = {
  __typename?: 'orders_notifications_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Notifications>;
};

/** on_conflict condition type for table "orders.notifications" */
export type Orders_Notifications_On_Conflict = {
  constraint: Orders_Notifications_Constraint;
  update_columns?: Array<Orders_Notifications_Update_Column>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.notifications". */
export type Orders_Notifications_Order_By = {
  comment?: InputMaybe<Orders_Comments_Order_By>;
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Orders_Orders_Order_By>;
  order_id?: InputMaybe<Order_By>;
  seen?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders.notifications */
export type Orders_Notifications_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.notifications" */
export enum Orders_Notifications_Select_Column {
  /** column name */
  CommentId = 'comment_id',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Seen = 'seen',
  /** column name */
  UserId = 'user_id'
}

/** select "orders_notifications_aggregate_bool_exp_bool_and_arguments_columns" columns of table "orders.notifications" */
export enum Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Seen = 'seen'
}

/** select "orders_notifications_aggregate_bool_exp_bool_or_arguments_columns" columns of table "orders.notifications" */
export enum Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Seen = 'seen'
}

/** input type for updating data in table "orders.notifications" */
export type Orders_Notifications_Set_Input = {
  comment_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  seen?: InputMaybe<Scalars['Boolean']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Notifications_Stddev_Fields = {
  __typename?: 'orders_notifications_stddev_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.notifications" */
export type Orders_Notifications_Stddev_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Notifications_Stddev_Pop_Fields = {
  __typename?: 'orders_notifications_stddev_pop_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.notifications" */
export type Orders_Notifications_Stddev_Pop_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Notifications_Stddev_Samp_Fields = {
  __typename?: 'orders_notifications_stddev_samp_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.notifications" */
export type Orders_Notifications_Stddev_Samp_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_notifications" */
export type Orders_Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Notifications_Stream_Cursor_Value_Input = {
  comment_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  seen?: InputMaybe<Scalars['Boolean']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Orders_Notifications_Sum_Fields = {
  __typename?: 'orders_notifications_sum_fields';
  comment_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "orders.notifications" */
export type Orders_Notifications_Sum_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** update columns of table "orders.notifications" */
export enum Orders_Notifications_Update_Column {
  /** column name */
  CommentId = 'comment_id',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Seen = 'seen',
  /** column name */
  UserId = 'user_id'
}

export type Orders_Notifications_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Notifications_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Notifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Notifications_Var_Pop_Fields = {
  __typename?: 'orders_notifications_var_pop_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.notifications" */
export type Orders_Notifications_Var_Pop_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Notifications_Var_Samp_Fields = {
  __typename?: 'orders_notifications_var_samp_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.notifications" */
export type Orders_Notifications_Var_Samp_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Notifications_Variance_Fields = {
  __typename?: 'orders_notifications_variance_fields';
  comment_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.notifications" */
export type Orders_Notifications_Variance_Order_By = {
  comment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "orders.order_items" */
export type Orders_Order_Items = {
  __typename?: 'orders_order_items';
  assembler_name?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** An object relationship */
  order: Orders_Orders;
  order_id: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
};

/** aggregated selection of "orders.order_items" */
export type Orders_Order_Items_Aggregate = {
  __typename?: 'orders_order_items_aggregate';
  aggregate?: Maybe<Orders_Order_Items_Aggregate_Fields>;
  nodes: Array<Orders_Order_Items>;
};

export type Orders_Order_Items_Aggregate_Bool_Exp = {
  count?: InputMaybe<Orders_Order_Items_Aggregate_Bool_Exp_Count>;
};

export type Orders_Order_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Order_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.order_items" */
export type Orders_Order_Items_Aggregate_Fields = {
  __typename?: 'orders_order_items_aggregate_fields';
  avg?: Maybe<Orders_Order_Items_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Order_Items_Max_Fields>;
  min?: Maybe<Orders_Order_Items_Min_Fields>;
  stddev?: Maybe<Orders_Order_Items_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Order_Items_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Order_Items_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Order_Items_Sum_Fields>;
  var_pop?: Maybe<Orders_Order_Items_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Order_Items_Var_Samp_Fields>;
  variance?: Maybe<Orders_Order_Items_Variance_Fields>;
};


/** aggregate fields of "orders.order_items" */
export type Orders_Order_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.order_items" */
export type Orders_Order_Items_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Order_Items_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Order_Items_Max_Order_By>;
  min?: InputMaybe<Orders_Order_Items_Min_Order_By>;
  stddev?: InputMaybe<Orders_Order_Items_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Order_Items_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Order_Items_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Order_Items_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Order_Items_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Order_Items_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Order_Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.order_items" */
export type Orders_Order_Items_Arr_Rel_Insert_Input = {
  data: Array<Orders_Order_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Order_Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Order_Items_Avg_Fields = {
  __typename?: 'orders_order_items_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.order_items" */
export type Orders_Order_Items_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.order_items". All fields are combined with a logical 'AND'. */
export type Orders_Order_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Order_Items_Bool_Exp>>;
  _not?: InputMaybe<Orders_Order_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Order_Items_Bool_Exp>>;
  assembler_name?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  order?: InputMaybe<Orders_Orders_Bool_Exp>;
  order_id?: InputMaybe<Int_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders.order_items" */
export enum Orders_Order_Items_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrderItemsPkey = 'OrderItems_pkey'
}

/** input type for incrementing numeric columns in table "orders.order_items" */
export type Orders_Order_Items_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "orders.order_items" */
export type Orders_Order_Items_Insert_Input = {
  assembler_name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Orders_Orders_Obj_Rel_Insert_Input>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Orders_Order_Items_Max_Fields = {
  __typename?: 'orders_order_items_max_fields';
  assembler_name?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "orders.order_items" */
export type Orders_Order_Items_Max_Order_By = {
  assembler_name?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Order_Items_Min_Fields = {
  __typename?: 'orders_order_items_min_fields';
  assembler_name?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "orders.order_items" */
export type Orders_Order_Items_Min_Order_By = {
  assembler_name?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.order_items" */
export type Orders_Order_Items_Mutation_Response = {
  __typename?: 'orders_order_items_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Order_Items>;
};

/** on_conflict condition type for table "orders.order_items" */
export type Orders_Order_Items_On_Conflict = {
  constraint: Orders_Order_Items_Constraint;
  update_columns?: Array<Orders_Order_Items_Update_Column>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.order_items". */
export type Orders_Order_Items_Order_By = {
  assembler_name?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  order?: InputMaybe<Orders_Orders_Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders.order_items */
export type Orders_Order_Items_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.order_items" */
export enum Orders_Order_Items_Select_Column {
  /** column name */
  AssemblerName = 'assembler_name',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Quantity = 'quantity'
}

/** input type for updating data in table "orders.order_items" */
export type Orders_Order_Items_Set_Input = {
  assembler_name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Order_Items_Stddev_Fields = {
  __typename?: 'orders_order_items_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.order_items" */
export type Orders_Order_Items_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Order_Items_Stddev_Pop_Fields = {
  __typename?: 'orders_order_items_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.order_items" */
export type Orders_Order_Items_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Order_Items_Stddev_Samp_Fields = {
  __typename?: 'orders_order_items_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.order_items" */
export type Orders_Order_Items_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_order_items" */
export type Orders_Order_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Order_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Order_Items_Stream_Cursor_Value_Input = {
  assembler_name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Orders_Order_Items_Sum_Fields = {
  __typename?: 'orders_order_items_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "orders.order_items" */
export type Orders_Order_Items_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** update columns of table "orders.order_items" */
export enum Orders_Order_Items_Update_Column {
  /** column name */
  AssemblerName = 'assembler_name',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  Quantity = 'quantity'
}

export type Orders_Order_Items_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Order_Items_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Order_Items_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Order_Items_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Order_Items_Var_Pop_Fields = {
  __typename?: 'orders_order_items_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.order_items" */
export type Orders_Order_Items_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Order_Items_Var_Samp_Fields = {
  __typename?: 'orders_order_items_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.order_items" */
export type Orders_Order_Items_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Order_Items_Variance_Fields = {
  __typename?: 'orders_order_items_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.order_items" */
export type Orders_Order_Items_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** columns and relationships of "orders.order_payments" */
export type Orders_Order_Payments = {
  __typename?: 'orders_order_payments';
  amount: Scalars['numeric']['output'];
  date: Scalars['timestamp']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  order: Orders_Orders;
  order_id: Scalars['Int']['output'];
};

/** aggregated selection of "orders.order_payments" */
export type Orders_Order_Payments_Aggregate = {
  __typename?: 'orders_order_payments_aggregate';
  aggregate?: Maybe<Orders_Order_Payments_Aggregate_Fields>;
  nodes: Array<Orders_Order_Payments>;
};

export type Orders_Order_Payments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Orders_Order_Payments_Aggregate_Bool_Exp_Count>;
};

export type Orders_Order_Payments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.order_payments" */
export type Orders_Order_Payments_Aggregate_Fields = {
  __typename?: 'orders_order_payments_aggregate_fields';
  avg?: Maybe<Orders_Order_Payments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Order_Payments_Max_Fields>;
  min?: Maybe<Orders_Order_Payments_Min_Fields>;
  stddev?: Maybe<Orders_Order_Payments_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Order_Payments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Order_Payments_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Order_Payments_Sum_Fields>;
  var_pop?: Maybe<Orders_Order_Payments_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Order_Payments_Var_Samp_Fields>;
  variance?: Maybe<Orders_Order_Payments_Variance_Fields>;
};


/** aggregate fields of "orders.order_payments" */
export type Orders_Order_Payments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.order_payments" */
export type Orders_Order_Payments_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Order_Payments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Order_Payments_Max_Order_By>;
  min?: InputMaybe<Orders_Order_Payments_Min_Order_By>;
  stddev?: InputMaybe<Orders_Order_Payments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Order_Payments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Order_Payments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Order_Payments_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Order_Payments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Order_Payments_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Order_Payments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.order_payments" */
export type Orders_Order_Payments_Arr_Rel_Insert_Input = {
  data: Array<Orders_Order_Payments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Order_Payments_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Order_Payments_Avg_Fields = {
  __typename?: 'orders_order_payments_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.order_payments". All fields are combined with a logical 'AND'. */
export type Orders_Order_Payments_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Order_Payments_Bool_Exp>>;
  _not?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Order_Payments_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  date?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  order?: InputMaybe<Orders_Orders_Bool_Exp>;
  order_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders.order_payments" */
export enum Orders_Order_Payments_Constraint {
  /** unique or primary key constraint on columns "id" */
  PaymentHistoryIdKey = 'PaymentHistory_id_key',
  /** unique or primary key constraint on columns "id" */
  PaymentHistoryPkey = 'PaymentHistory_pkey'
}

/** input type for incrementing numeric columns in table "orders.order_payments" */
export type Orders_Order_Payments_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "orders.order_payments" */
export type Orders_Order_Payments_Insert_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  date?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Orders_Orders_Obj_Rel_Insert_Input>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Orders_Order_Payments_Max_Fields = {
  __typename?: 'orders_order_payments_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Order_Payments_Min_Fields = {
  __typename?: 'orders_order_payments_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.order_payments" */
export type Orders_Order_Payments_Mutation_Response = {
  __typename?: 'orders_order_payments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Order_Payments>;
};

/** on_conflict condition type for table "orders.order_payments" */
export type Orders_Order_Payments_On_Conflict = {
  constraint: Orders_Order_Payments_Constraint;
  update_columns?: Array<Orders_Order_Payments_Update_Column>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.order_payments". */
export type Orders_Order_Payments_Order_By = {
  amount?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Orders_Orders_Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders.order_payments */
export type Orders_Order_Payments_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.order_payments" */
export enum Orders_Order_Payments_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id'
}

/** input type for updating data in table "orders.order_payments" */
export type Orders_Order_Payments_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  date?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Order_Payments_Stddev_Fields = {
  __typename?: 'orders_order_payments_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Order_Payments_Stddev_Pop_Fields = {
  __typename?: 'orders_order_payments_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Order_Payments_Stddev_Samp_Fields = {
  __typename?: 'orders_order_payments_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_order_payments" */
export type Orders_Order_Payments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Order_Payments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Order_Payments_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  date?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Orders_Order_Payments_Sum_Fields = {
  __typename?: 'orders_order_payments_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  order_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** update columns of table "orders.order_payments" */
export enum Orders_Order_Payments_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Date = 'date',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'order_id'
}

export type Orders_Order_Payments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Order_Payments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Order_Payments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Order_Payments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Order_Payments_Var_Pop_Fields = {
  __typename?: 'orders_order_payments_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Order_Payments_Var_Samp_Fields = {
  __typename?: 'orders_order_payments_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Order_Payments_Variance_Fields = {
  __typename?: 'orders_order_payments_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  order_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.order_payments" */
export type Orders_Order_Payments_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "orders.orders" */
export type Orders_Orders = {
  __typename?: 'orders_orders';
  acceptance_date?: Maybe<Scalars['timestamp']['output']>;
  actual_shipping_date?: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  attachments: Array<Orders_Attachments>;
  /** An aggregate relationship */
  attachments_aggregate: Orders_Attachments_Aggregate;
  awaiting_dispatch: Scalars['Boolean']['output'];
  city?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  comments: Array<Orders_Comments>;
  /** An aggregate relationship */
  comments_aggregate: Orders_Comments_Aggregate;
  contractor?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamp']['output'];
  id: Scalars['Int']['output'];
  invoice_number?: Maybe<Scalars['String']['output']>;
  is_reclamation?: Maybe<Scalars['Boolean']['output']>;
  manager_id?: Maybe<Scalars['Int']['output']>;
  need_attention?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  notifications: Array<Orders_Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Orders_Notifications_Aggregate;
  /** An array relationship */
  order_items: Array<Orders_Order_Items>;
  /** An aggregate relationship */
  order_items_aggregate: Orders_Order_Items_Aggregate;
  order_number?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  order_payments: Array<Orders_Order_Payments>;
  /** An aggregate relationship */
  order_payments_aggregate: Orders_Order_Payments_Aggregate;
  shipping_date?: Maybe<Scalars['date']['output']>;
  status: Scalars['Int']['output'];
  total_amount?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersAttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersAttachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersCommentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersComments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersOrder_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersOrder_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersOrder_PaymentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


/** columns and relationships of "orders.orders" */
export type Orders_OrdersOrder_Payments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};

/** aggregated selection of "orders.orders" */
export type Orders_Orders_Aggregate = {
  __typename?: 'orders_orders_aggregate';
  aggregate?: Maybe<Orders_Orders_Aggregate_Fields>;
  nodes: Array<Orders_Orders>;
};

export type Orders_Orders_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Orders_Orders_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Orders_Orders_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Orders_Orders_Aggregate_Bool_Exp_Count>;
};

export type Orders_Orders_Aggregate_Bool_Exp_Bool_And = {
  arguments: Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Orders_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Orders_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Orders_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders.orders" */
export type Orders_Orders_Aggregate_Fields = {
  __typename?: 'orders_orders_aggregate_fields';
  avg?: Maybe<Orders_Orders_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Orders_Max_Fields>;
  min?: Maybe<Orders_Orders_Min_Fields>;
  stddev?: Maybe<Orders_Orders_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Orders_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Orders_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Orders_Sum_Fields>;
  var_pop?: Maybe<Orders_Orders_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Orders_Var_Samp_Fields>;
  variance?: Maybe<Orders_Orders_Variance_Fields>;
};


/** aggregate fields of "orders.orders" */
export type Orders_Orders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders.orders" */
export type Orders_Orders_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Orders_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Orders_Max_Order_By>;
  min?: InputMaybe<Orders_Orders_Min_Order_By>;
  stddev?: InputMaybe<Orders_Orders_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Orders_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Orders_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Orders_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Orders_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Orders_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Orders_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders.orders" */
export type Orders_Orders_Arr_Rel_Insert_Input = {
  data: Array<Orders_Orders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Orders_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Orders_Avg_Fields = {
  __typename?: 'orders_orders_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders.orders" */
export type Orders_Orders_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders.orders". All fields are combined with a logical 'AND'. */
export type Orders_Orders_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Orders_Bool_Exp>>;
  _not?: InputMaybe<Orders_Orders_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Orders_Bool_Exp>>;
  acceptance_date?: InputMaybe<Timestamp_Comparison_Exp>;
  actual_shipping_date?: InputMaybe<Timestamp_Comparison_Exp>;
  attachments?: InputMaybe<Orders_Attachments_Bool_Exp>;
  attachments_aggregate?: InputMaybe<Orders_Attachments_Aggregate_Bool_Exp>;
  awaiting_dispatch?: InputMaybe<Boolean_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  comment?: InputMaybe<String_Comparison_Exp>;
  comments?: InputMaybe<Orders_Comments_Bool_Exp>;
  comments_aggregate?: InputMaybe<Orders_Comments_Aggregate_Bool_Exp>;
  contractor?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  invoice_number?: InputMaybe<String_Comparison_Exp>;
  is_reclamation?: InputMaybe<Boolean_Comparison_Exp>;
  manager_id?: InputMaybe<Int_Comparison_Exp>;
  need_attention?: InputMaybe<String_Comparison_Exp>;
  notifications?: InputMaybe<Orders_Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp>;
  order_items?: InputMaybe<Orders_Order_Items_Bool_Exp>;
  order_items_aggregate?: InputMaybe<Orders_Order_Items_Aggregate_Bool_Exp>;
  order_number?: InputMaybe<String_Comparison_Exp>;
  order_payments?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
  order_payments_aggregate?: InputMaybe<Orders_Order_Payments_Aggregate_Bool_Exp>;
  shipping_date?: InputMaybe<Date_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  total_amount?: InputMaybe<Numeric_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
};

/** unique or primary key constraints on table "orders.orders" */
export enum Orders_Orders_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrdersPkey = 'Orders_pkey'
}

/** input type for incrementing numeric columns in table "orders.orders" */
export type Orders_Orders_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  manager_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "orders.orders" */
export type Orders_Orders_Insert_Input = {
  acceptance_date?: InputMaybe<Scalars['timestamp']['input']>;
  actual_shipping_date?: InputMaybe<Scalars['timestamp']['input']>;
  attachments?: InputMaybe<Orders_Attachments_Arr_Rel_Insert_Input>;
  awaiting_dispatch?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Orders_Comments_Arr_Rel_Insert_Input>;
  contractor?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  is_reclamation?: InputMaybe<Scalars['Boolean']['input']>;
  manager_id?: InputMaybe<Scalars['Int']['input']>;
  need_attention?: InputMaybe<Scalars['String']['input']>;
  notifications?: InputMaybe<Orders_Notifications_Arr_Rel_Insert_Input>;
  order_items?: InputMaybe<Orders_Order_Items_Arr_Rel_Insert_Input>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  order_payments?: InputMaybe<Orders_Order_Payments_Arr_Rel_Insert_Input>;
  shipping_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Orders_Orders_Max_Fields = {
  __typename?: 'orders_orders_max_fields';
  acceptance_date?: Maybe<Scalars['timestamp']['output']>;
  actual_shipping_date?: Maybe<Scalars['timestamp']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  contractor?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  invoice_number?: Maybe<Scalars['String']['output']>;
  manager_id?: Maybe<Scalars['Int']['output']>;
  need_attention?: Maybe<Scalars['String']['output']>;
  order_number?: Maybe<Scalars['String']['output']>;
  shipping_date?: Maybe<Scalars['date']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  total_amount?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "orders.orders" */
export type Orders_Orders_Max_Order_By = {
  acceptance_date?: InputMaybe<Order_By>;
  actual_shipping_date?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  comment?: InputMaybe<Order_By>;
  contractor?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  need_attention?: InputMaybe<Order_By>;
  order_number?: InputMaybe<Order_By>;
  shipping_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Orders_Min_Fields = {
  __typename?: 'orders_orders_min_fields';
  acceptance_date?: Maybe<Scalars['timestamp']['output']>;
  actual_shipping_date?: Maybe<Scalars['timestamp']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  contractor?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  invoice_number?: Maybe<Scalars['String']['output']>;
  manager_id?: Maybe<Scalars['Int']['output']>;
  need_attention?: Maybe<Scalars['String']['output']>;
  order_number?: Maybe<Scalars['String']['output']>;
  shipping_date?: Maybe<Scalars['date']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  total_amount?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "orders.orders" */
export type Orders_Orders_Min_Order_By = {
  acceptance_date?: InputMaybe<Order_By>;
  actual_shipping_date?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  comment?: InputMaybe<Order_By>;
  contractor?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  need_attention?: InputMaybe<Order_By>;
  order_number?: InputMaybe<Order_By>;
  shipping_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders.orders" */
export type Orders_Orders_Mutation_Response = {
  __typename?: 'orders_orders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders_Orders>;
};

/** input type for inserting object relation for remote table "orders.orders" */
export type Orders_Orders_Obj_Rel_Insert_Input = {
  data: Orders_Orders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_Orders_On_Conflict>;
};

/** on_conflict condition type for table "orders.orders" */
export type Orders_Orders_On_Conflict = {
  constraint: Orders_Orders_Constraint;
  update_columns?: Array<Orders_Orders_Update_Column>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};

/** Ordering options when selecting data from "orders.orders". */
export type Orders_Orders_Order_By = {
  acceptance_date?: InputMaybe<Order_By>;
  actual_shipping_date?: InputMaybe<Order_By>;
  attachments_aggregate?: InputMaybe<Orders_Attachments_Aggregate_Order_By>;
  awaiting_dispatch?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  comment?: InputMaybe<Order_By>;
  comments_aggregate?: InputMaybe<Orders_Comments_Aggregate_Order_By>;
  contractor?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  is_reclamation?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  need_attention?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Order_By>;
  order_items_aggregate?: InputMaybe<Orders_Order_Items_Aggregate_Order_By>;
  order_number?: InputMaybe<Order_By>;
  order_payments_aggregate?: InputMaybe<Orders_Order_Payments_Aggregate_Order_By>;
  shipping_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
};

/** primary key columns input for table: orders.orders */
export type Orders_Orders_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "orders.orders" */
export enum Orders_Orders_Select_Column {
  /** column name */
  AcceptanceDate = 'acceptance_date',
  /** column name */
  ActualShippingDate = 'actual_shipping_date',
  /** column name */
  AwaitingDispatch = 'awaiting_dispatch',
  /** column name */
  City = 'city',
  /** column name */
  Comment = 'comment',
  /** column name */
  Contractor = 'contractor',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  InvoiceNumber = 'invoice_number',
  /** column name */
  IsReclamation = 'is_reclamation',
  /** column name */
  ManagerId = 'manager_id',
  /** column name */
  NeedAttention = 'need_attention',
  /** column name */
  OrderNumber = 'order_number',
  /** column name */
  ShippingDate = 'shipping_date',
  /** column name */
  Status = 'status',
  /** column name */
  TotalAmount = 'total_amount'
}

/** select "orders_orders_aggregate_bool_exp_bool_and_arguments_columns" columns of table "orders.orders" */
export enum Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  AwaitingDispatch = 'awaiting_dispatch',
  /** column name */
  IsReclamation = 'is_reclamation'
}

/** select "orders_orders_aggregate_bool_exp_bool_or_arguments_columns" columns of table "orders.orders" */
export enum Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  AwaitingDispatch = 'awaiting_dispatch',
  /** column name */
  IsReclamation = 'is_reclamation'
}

/** input type for updating data in table "orders.orders" */
export type Orders_Orders_Set_Input = {
  acceptance_date?: InputMaybe<Scalars['timestamp']['input']>;
  actual_shipping_date?: InputMaybe<Scalars['timestamp']['input']>;
  awaiting_dispatch?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  contractor?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  is_reclamation?: InputMaybe<Scalars['Boolean']['input']>;
  manager_id?: InputMaybe<Scalars['Int']['input']>;
  need_attention?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  shipping_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Orders_Stddev_Fields = {
  __typename?: 'orders_orders_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders.orders" */
export type Orders_Orders_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Orders_Stddev_Pop_Fields = {
  __typename?: 'orders_orders_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders.orders" */
export type Orders_Orders_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Orders_Stddev_Samp_Fields = {
  __typename?: 'orders_orders_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders.orders" */
export type Orders_Orders_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders_orders" */
export type Orders_Orders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Orders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Orders_Stream_Cursor_Value_Input = {
  acceptance_date?: InputMaybe<Scalars['timestamp']['input']>;
  actual_shipping_date?: InputMaybe<Scalars['timestamp']['input']>;
  awaiting_dispatch?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  contractor?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  is_reclamation?: InputMaybe<Scalars['Boolean']['input']>;
  manager_id?: InputMaybe<Scalars['Int']['input']>;
  need_attention?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  shipping_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Orders_Orders_Sum_Fields = {
  __typename?: 'orders_orders_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  manager_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  total_amount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "orders.orders" */
export type Orders_Orders_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** update columns of table "orders.orders" */
export enum Orders_Orders_Update_Column {
  /** column name */
  AcceptanceDate = 'acceptance_date',
  /** column name */
  ActualShippingDate = 'actual_shipping_date',
  /** column name */
  AwaitingDispatch = 'awaiting_dispatch',
  /** column name */
  City = 'city',
  /** column name */
  Comment = 'comment',
  /** column name */
  Contractor = 'contractor',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  InvoiceNumber = 'invoice_number',
  /** column name */
  IsReclamation = 'is_reclamation',
  /** column name */
  ManagerId = 'manager_id',
  /** column name */
  NeedAttention = 'need_attention',
  /** column name */
  OrderNumber = 'order_number',
  /** column name */
  ShippingDate = 'shipping_date',
  /** column name */
  Status = 'status',
  /** column name */
  TotalAmount = 'total_amount'
}

export type Orders_Orders_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Orders_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Orders_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Orders_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Orders_Var_Pop_Fields = {
  __typename?: 'orders_orders_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders.orders" */
export type Orders_Orders_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Orders_Var_Samp_Fields = {
  __typename?: 'orders_orders_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders.orders" */
export type Orders_Orders_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Orders_Variance_Fields = {
  __typename?: 'orders_orders_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  manager_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders.orders" */
export type Orders_Orders_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  manager_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

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
  /** fetch data from the table: "metal_flow.detail_materials" */
  metal_flow_detail_materials: Array<Metal_Flow_Detail_Materials>;
  /** fetch aggregated fields from the table: "metal_flow.detail_materials" */
  metal_flow_detail_materials_aggregate: Metal_Flow_Detail_Materials_Aggregate;
  /** fetch data from the table: "metal_flow.detail_materials" using primary key columns */
  metal_flow_detail_materials_by_pk?: Maybe<Metal_Flow_Detail_Materials>;
  /** fetch data from the table: "metal_flow.details" */
  metal_flow_details: Array<Metal_Flow_Details>;
  /** fetch aggregated fields from the table: "metal_flow.details" */
  metal_flow_details_aggregate: Metal_Flow_Details_Aggregate;
  /** fetch data from the table: "metal_flow.details" using primary key columns */
  metal_flow_details_by_pk?: Maybe<Metal_Flow_Details>;
  /** fetch data from the table: "metal_flow.materials" */
  metal_flow_materials: Array<Metal_Flow_Materials>;
  /** fetch aggregated fields from the table: "metal_flow.materials" */
  metal_flow_materials_aggregate: Metal_Flow_Materials_Aggregate;
  /** fetch data from the table: "metal_flow.materials" using primary key columns */
  metal_flow_materials_by_pk?: Maybe<Metal_Flow_Materials>;
  /** fetch data from the table: "metal_flow.supplies" */
  metal_flow_supplies: Array<Metal_Flow_Supplies>;
  /** fetch aggregated fields from the table: "metal_flow.supplies" */
  metal_flow_supplies_aggregate: Metal_Flow_Supplies_Aggregate;
  /** fetch data from the table: "metal_flow.supplies" using primary key columns */
  metal_flow_supplies_by_pk?: Maybe<Metal_Flow_Supplies>;
  /** fetch data from the table: "metal_flow.writeoffs" */
  metal_flow_writeoffs: Array<Metal_Flow_Writeoffs>;
  /** fetch aggregated fields from the table: "metal_flow.writeoffs" */
  metal_flow_writeoffs_aggregate: Metal_Flow_Writeoffs_Aggregate;
  /** fetch data from the table: "metal_flow.writeoffs" using primary key columns */
  metal_flow_writeoffs_by_pk?: Maybe<Metal_Flow_Writeoffs>;
  /** fetch data from the table: "orders.attachments" */
  orders_attachments: Array<Orders_Attachments>;
  /** fetch aggregated fields from the table: "orders.attachments" */
  orders_attachments_aggregate: Orders_Attachments_Aggregate;
  /** fetch data from the table: "orders.attachments" using primary key columns */
  orders_attachments_by_pk?: Maybe<Orders_Attachments>;
  /** fetch data from the table: "orders.comments" */
  orders_comments: Array<Orders_Comments>;
  /** fetch aggregated fields from the table: "orders.comments" */
  orders_comments_aggregate: Orders_Comments_Aggregate;
  /** fetch data from the table: "orders.comments" using primary key columns */
  orders_comments_by_pk?: Maybe<Orders_Comments>;
  /** fetch data from the table: "orders.notifications" */
  orders_notifications: Array<Orders_Notifications>;
  /** fetch aggregated fields from the table: "orders.notifications" */
  orders_notifications_aggregate: Orders_Notifications_Aggregate;
  /** fetch data from the table: "orders.notifications" using primary key columns */
  orders_notifications_by_pk?: Maybe<Orders_Notifications>;
  /** fetch data from the table: "orders.order_items" */
  orders_order_items: Array<Orders_Order_Items>;
  /** fetch aggregated fields from the table: "orders.order_items" */
  orders_order_items_aggregate: Orders_Order_Items_Aggregate;
  /** fetch data from the table: "orders.order_items" using primary key columns */
  orders_order_items_by_pk?: Maybe<Orders_Order_Items>;
  /** fetch data from the table: "orders.order_payments" */
  orders_order_payments: Array<Orders_Order_Payments>;
  /** fetch aggregated fields from the table: "orders.order_payments" */
  orders_order_payments_aggregate: Orders_Order_Payments_Aggregate;
  /** fetch data from the table: "orders.order_payments" using primary key columns */
  orders_order_payments_by_pk?: Maybe<Orders_Order_Payments>;
  /** fetch data from the table: "orders.orders" */
  orders_orders: Array<Orders_Orders>;
  /** fetch aggregated fields from the table: "orders.orders" */
  orders_orders_aggregate: Orders_Orders_Aggregate;
  /** fetch data from the table: "orders.orders" using primary key columns */
  orders_orders_by_pk?: Maybe<Orders_Orders>;
  /** An array relationship */
  refresh_tokens: Array<Refresh_Tokens>;
  /** An aggregate relationship */
  refresh_tokens_aggregate: Refresh_Tokens_Aggregate;
  /** fetch data from the table: "refresh_tokens" using primary key columns */
  refresh_tokens_by_pk?: Maybe<Refresh_Tokens>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
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


export type Query_RootMetal_Flow_Detail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


export type Query_RootMetal_Flow_Detail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


export type Query_RootMetal_Flow_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


export type Query_RootMetal_Flow_DetailsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Details_Order_By>>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};


export type Query_RootMetal_Flow_Details_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Details_Order_By>>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};


export type Query_RootMetal_Flow_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Flow_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};


export type Query_RootMetal_Flow_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};


export type Query_RootMetal_Flow_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Flow_SuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


export type Query_RootMetal_Flow_Supplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


export type Query_RootMetal_Flow_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMetal_Flow_WriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


export type Query_RootMetal_Flow_Writeoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


export type Query_RootMetal_Flow_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_AttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


export type Query_RootOrders_Attachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


export type Query_RootOrders_Attachments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


export type Query_RootOrders_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


export type Query_RootOrders_Comments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


export type Query_RootOrders_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


export type Query_RootOrders_Notifications_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_Order_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


export type Query_RootOrders_Order_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


export type Query_RootOrders_Order_Items_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_Order_PaymentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


export type Query_RootOrders_Order_Payments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


export type Query_RootOrders_Order_Payments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootOrders_OrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


export type Query_RootOrders_Orders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


export type Query_RootOrders_Orders_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootRefresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


export type Query_RootRefresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


export type Query_RootRefresh_Tokens_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** columns and relationships of "refresh_tokens" */
export type Refresh_Tokens = {
  __typename?: 'refresh_tokens';
  id: Scalars['Int']['output'];
  token: Scalars['String']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['Int']['output'];
};

/** aggregated selection of "refresh_tokens" */
export type Refresh_Tokens_Aggregate = {
  __typename?: 'refresh_tokens_aggregate';
  aggregate?: Maybe<Refresh_Tokens_Aggregate_Fields>;
  nodes: Array<Refresh_Tokens>;
};

export type Refresh_Tokens_Aggregate_Bool_Exp = {
  count?: InputMaybe<Refresh_Tokens_Aggregate_Bool_Exp_Count>;
};

export type Refresh_Tokens_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Refresh_Tokens_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "refresh_tokens" */
export type Refresh_Tokens_Aggregate_Fields = {
  __typename?: 'refresh_tokens_aggregate_fields';
  avg?: Maybe<Refresh_Tokens_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Refresh_Tokens_Max_Fields>;
  min?: Maybe<Refresh_Tokens_Min_Fields>;
  stddev?: Maybe<Refresh_Tokens_Stddev_Fields>;
  stddev_pop?: Maybe<Refresh_Tokens_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Refresh_Tokens_Stddev_Samp_Fields>;
  sum?: Maybe<Refresh_Tokens_Sum_Fields>;
  var_pop?: Maybe<Refresh_Tokens_Var_Pop_Fields>;
  var_samp?: Maybe<Refresh_Tokens_Var_Samp_Fields>;
  variance?: Maybe<Refresh_Tokens_Variance_Fields>;
};


/** aggregate fields of "refresh_tokens" */
export type Refresh_Tokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "refresh_tokens" */
export type Refresh_Tokens_Aggregate_Order_By = {
  avg?: InputMaybe<Refresh_Tokens_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Refresh_Tokens_Max_Order_By>;
  min?: InputMaybe<Refresh_Tokens_Min_Order_By>;
  stddev?: InputMaybe<Refresh_Tokens_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Refresh_Tokens_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Refresh_Tokens_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Refresh_Tokens_Sum_Order_By>;
  var_pop?: InputMaybe<Refresh_Tokens_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Refresh_Tokens_Var_Samp_Order_By>;
  variance?: InputMaybe<Refresh_Tokens_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "refresh_tokens" */
export type Refresh_Tokens_Arr_Rel_Insert_Input = {
  data: Array<Refresh_Tokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Refresh_Tokens_On_Conflict>;
};

/** aggregate avg on columns */
export type Refresh_Tokens_Avg_Fields = {
  __typename?: 'refresh_tokens_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "refresh_tokens". All fields are combined with a logical 'AND'. */
export type Refresh_Tokens_Bool_Exp = {
  _and?: InputMaybe<Array<Refresh_Tokens_Bool_Exp>>;
  _not?: InputMaybe<Refresh_Tokens_Bool_Exp>;
  _or?: InputMaybe<Array<Refresh_Tokens_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "refresh_tokens" */
export enum Refresh_Tokens_Constraint {
  /** unique or primary key constraint on columns "id" */
  TokrnsPkey = 'Tokrns_pkey'
}

/** input type for incrementing numeric columns in table "refresh_tokens" */
export type Refresh_Tokens_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "refresh_tokens" */
export type Refresh_Tokens_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Refresh_Tokens_Max_Fields = {
  __typename?: 'refresh_tokens_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Refresh_Tokens_Min_Fields = {
  __typename?: 'refresh_tokens_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "refresh_tokens" */
export type Refresh_Tokens_Mutation_Response = {
  __typename?: 'refresh_tokens_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Refresh_Tokens>;
};

/** on_conflict condition type for table "refresh_tokens" */
export type Refresh_Tokens_On_Conflict = {
  constraint: Refresh_Tokens_Constraint;
  update_columns?: Array<Refresh_Tokens_Update_Column>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};

/** Ordering options when selecting data from "refresh_tokens". */
export type Refresh_Tokens_Order_By = {
  id?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: refresh_tokens */
export type Refresh_Tokens_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "refresh_tokens" */
export enum Refresh_Tokens_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Token = 'token',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "refresh_tokens" */
export type Refresh_Tokens_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Refresh_Tokens_Stddev_Fields = {
  __typename?: 'refresh_tokens_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Refresh_Tokens_Stddev_Pop_Fields = {
  __typename?: 'refresh_tokens_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Refresh_Tokens_Stddev_Samp_Fields = {
  __typename?: 'refresh_tokens_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "refresh_tokens" */
export type Refresh_Tokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Refresh_Tokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Refresh_Tokens_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Refresh_Tokens_Sum_Fields = {
  __typename?: 'refresh_tokens_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** update columns of table "refresh_tokens" */
export enum Refresh_Tokens_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Token = 'token',
  /** column name */
  UserId = 'user_id'
}

export type Refresh_Tokens_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Refresh_Tokens_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Refresh_Tokens_Set_Input>;
  /** filter the rows which have to be updated */
  where: Refresh_Tokens_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Refresh_Tokens_Var_Pop_Fields = {
  __typename?: 'refresh_tokens_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Refresh_Tokens_Var_Samp_Fields = {
  __typename?: 'refresh_tokens_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Refresh_Tokens_Variance_Fields = {
  __typename?: 'refresh_tokens_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "refresh_tokens" */
export type Refresh_Tokens_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
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
  /** fetch data from the table: "metal_flow.detail_materials" */
  metal_flow_detail_materials: Array<Metal_Flow_Detail_Materials>;
  /** fetch aggregated fields from the table: "metal_flow.detail_materials" */
  metal_flow_detail_materials_aggregate: Metal_Flow_Detail_Materials_Aggregate;
  /** fetch data from the table: "metal_flow.detail_materials" using primary key columns */
  metal_flow_detail_materials_by_pk?: Maybe<Metal_Flow_Detail_Materials>;
  /** fetch data from the table in a streaming manner: "metal_flow.detail_materials" */
  metal_flow_detail_materials_stream: Array<Metal_Flow_Detail_Materials>;
  /** fetch data from the table: "metal_flow.details" */
  metal_flow_details: Array<Metal_Flow_Details>;
  /** fetch aggregated fields from the table: "metal_flow.details" */
  metal_flow_details_aggregate: Metal_Flow_Details_Aggregate;
  /** fetch data from the table: "metal_flow.details" using primary key columns */
  metal_flow_details_by_pk?: Maybe<Metal_Flow_Details>;
  /** fetch data from the table in a streaming manner: "metal_flow.details" */
  metal_flow_details_stream: Array<Metal_Flow_Details>;
  /** fetch data from the table: "metal_flow.materials" */
  metal_flow_materials: Array<Metal_Flow_Materials>;
  /** fetch aggregated fields from the table: "metal_flow.materials" */
  metal_flow_materials_aggregate: Metal_Flow_Materials_Aggregate;
  /** fetch data from the table: "metal_flow.materials" using primary key columns */
  metal_flow_materials_by_pk?: Maybe<Metal_Flow_Materials>;
  /** fetch data from the table in a streaming manner: "metal_flow.materials" */
  metal_flow_materials_stream: Array<Metal_Flow_Materials>;
  /** fetch data from the table: "metal_flow.supplies" */
  metal_flow_supplies: Array<Metal_Flow_Supplies>;
  /** fetch aggregated fields from the table: "metal_flow.supplies" */
  metal_flow_supplies_aggregate: Metal_Flow_Supplies_Aggregate;
  /** fetch data from the table: "metal_flow.supplies" using primary key columns */
  metal_flow_supplies_by_pk?: Maybe<Metal_Flow_Supplies>;
  /** fetch data from the table in a streaming manner: "metal_flow.supplies" */
  metal_flow_supplies_stream: Array<Metal_Flow_Supplies>;
  /** fetch data from the table: "metal_flow.writeoffs" */
  metal_flow_writeoffs: Array<Metal_Flow_Writeoffs>;
  /** fetch aggregated fields from the table: "metal_flow.writeoffs" */
  metal_flow_writeoffs_aggregate: Metal_Flow_Writeoffs_Aggregate;
  /** fetch data from the table: "metal_flow.writeoffs" using primary key columns */
  metal_flow_writeoffs_by_pk?: Maybe<Metal_Flow_Writeoffs>;
  /** fetch data from the table in a streaming manner: "metal_flow.writeoffs" */
  metal_flow_writeoffs_stream: Array<Metal_Flow_Writeoffs>;
  /** fetch data from the table: "orders.attachments" */
  orders_attachments: Array<Orders_Attachments>;
  /** fetch aggregated fields from the table: "orders.attachments" */
  orders_attachments_aggregate: Orders_Attachments_Aggregate;
  /** fetch data from the table: "orders.attachments" using primary key columns */
  orders_attachments_by_pk?: Maybe<Orders_Attachments>;
  /** fetch data from the table in a streaming manner: "orders.attachments" */
  orders_attachments_stream: Array<Orders_Attachments>;
  /** fetch data from the table: "orders.comments" */
  orders_comments: Array<Orders_Comments>;
  /** fetch aggregated fields from the table: "orders.comments" */
  orders_comments_aggregate: Orders_Comments_Aggregate;
  /** fetch data from the table: "orders.comments" using primary key columns */
  orders_comments_by_pk?: Maybe<Orders_Comments>;
  /** fetch data from the table in a streaming manner: "orders.comments" */
  orders_comments_stream: Array<Orders_Comments>;
  /** fetch data from the table: "orders.notifications" */
  orders_notifications: Array<Orders_Notifications>;
  /** fetch aggregated fields from the table: "orders.notifications" */
  orders_notifications_aggregate: Orders_Notifications_Aggregate;
  /** fetch data from the table: "orders.notifications" using primary key columns */
  orders_notifications_by_pk?: Maybe<Orders_Notifications>;
  /** fetch data from the table in a streaming manner: "orders.notifications" */
  orders_notifications_stream: Array<Orders_Notifications>;
  /** fetch data from the table: "orders.order_items" */
  orders_order_items: Array<Orders_Order_Items>;
  /** fetch aggregated fields from the table: "orders.order_items" */
  orders_order_items_aggregate: Orders_Order_Items_Aggregate;
  /** fetch data from the table: "orders.order_items" using primary key columns */
  orders_order_items_by_pk?: Maybe<Orders_Order_Items>;
  /** fetch data from the table in a streaming manner: "orders.order_items" */
  orders_order_items_stream: Array<Orders_Order_Items>;
  /** fetch data from the table: "orders.order_payments" */
  orders_order_payments: Array<Orders_Order_Payments>;
  /** fetch aggregated fields from the table: "orders.order_payments" */
  orders_order_payments_aggregate: Orders_Order_Payments_Aggregate;
  /** fetch data from the table: "orders.order_payments" using primary key columns */
  orders_order_payments_by_pk?: Maybe<Orders_Order_Payments>;
  /** fetch data from the table in a streaming manner: "orders.order_payments" */
  orders_order_payments_stream: Array<Orders_Order_Payments>;
  /** fetch data from the table: "orders.orders" */
  orders_orders: Array<Orders_Orders>;
  /** fetch aggregated fields from the table: "orders.orders" */
  orders_orders_aggregate: Orders_Orders_Aggregate;
  /** fetch data from the table: "orders.orders" using primary key columns */
  orders_orders_by_pk?: Maybe<Orders_Orders>;
  /** fetch data from the table in a streaming manner: "orders.orders" */
  orders_orders_stream: Array<Orders_Orders>;
  /** An array relationship */
  refresh_tokens: Array<Refresh_Tokens>;
  /** An aggregate relationship */
  refresh_tokens_aggregate: Refresh_Tokens_Aggregate;
  /** fetch data from the table: "refresh_tokens" using primary key columns */
  refresh_tokens_by_pk?: Maybe<Refresh_Tokens>;
  /** fetch data from the table in a streaming manner: "refresh_tokens" */
  refresh_tokens_stream: Array<Refresh_Tokens>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
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


export type Subscription_RootMetal_Flow_Detail_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Detail_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Detail_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Detail_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Detail_Materials_By_PkArgs = {
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Flow_Detail_Materials_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Flow_Detail_Materials_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Flow_Detail_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_DetailsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Details_Order_By>>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Details_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Details_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Details_Order_By>>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Details_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Flow_Details_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Flow_Details_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Flow_Details_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_MaterialsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Materials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Materials_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Materials_Order_By>>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Materials_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Flow_Materials_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Flow_Materials_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Flow_Materials_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_SuppliesArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Supplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Supplies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Supplies_Order_By>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Supplies_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Flow_Supplies_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Flow_Supplies_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Flow_Supplies_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_WriteoffsArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Writeoffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metal_Flow_Writeoffs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metal_Flow_Writeoffs_Order_By>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


export type Subscription_RootMetal_Flow_Writeoffs_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMetal_Flow_Writeoffs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metal_Flow_Writeoffs_Stream_Cursor_Input>>;
  where?: InputMaybe<Metal_Flow_Writeoffs_Bool_Exp>;
};


export type Subscription_RootOrders_AttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


export type Subscription_RootOrders_Attachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Attachments_Order_By>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


export type Subscription_RootOrders_Attachments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Attachments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Attachments_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Attachments_Bool_Exp>;
};


export type Subscription_RootOrders_CommentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


export type Subscription_RootOrders_Comments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


export type Subscription_RootOrders_Comments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Comments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Comments_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


export type Subscription_RootOrders_NotificationsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


export type Subscription_RootOrders_Notifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


export type Subscription_RootOrders_Notifications_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Notifications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


export type Subscription_RootOrders_Order_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


export type Subscription_RootOrders_Order_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Items_Order_By>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


export type Subscription_RootOrders_Order_Items_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Order_Items_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Order_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Order_Items_Bool_Exp>;
};


export type Subscription_RootOrders_Order_PaymentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


export type Subscription_RootOrders_Order_Payments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Order_Payments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_Payments_Order_By>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


export type Subscription_RootOrders_Order_Payments_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Order_Payments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Order_Payments_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Order_Payments_Bool_Exp>;
};


export type Subscription_RootOrders_OrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


export type Subscription_RootOrders_Orders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


export type Subscription_RootOrders_Orders_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootOrders_Orders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Orders_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


export type Subscription_RootRefresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


export type Subscription_RootRefresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


export type Subscription_RootRefresh_Tokens_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootRefresh_Tokens_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Refresh_Tokens_Stream_Cursor_Input>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
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

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  /** An array relationship */
  comments: Array<Orders_Comments>;
  /** An aggregate relationship */
  comments_aggregate: Orders_Comments_Aggregate;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  notifications: Array<Orders_Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Orders_Notifications_Aggregate;
  /** An array relationship */
  orders: Array<Orders_Orders>;
  /** An aggregate relationship */
  orders_aggregate: Orders_Orders_Aggregate;
  password?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  refresh_tokens: Array<Refresh_Tokens>;
  /** An aggregate relationship */
  refresh_tokens_aggregate: Refresh_Tokens_Aggregate;
  role: Scalars['Int']['output'];
};


/** columns and relationships of "users" */
export type UsersCommentsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersComments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Comments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Comments_Order_By>>;
  where?: InputMaybe<Orders_Comments_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Notifications_Order_By>>;
  where?: InputMaybe<Orders_Notifications_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersOrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Orders_Order_By>>;
  where?: InputMaybe<Orders_Orders_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersRefresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersRefresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Refresh_Tokens_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: 'users_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  comments?: InputMaybe<Orders_Comments_Bool_Exp>;
  comments_aggregate?: InputMaybe<Orders_Comments_Aggregate_Bool_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  notifications?: InputMaybe<Orders_Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Bool_Exp>;
  orders?: InputMaybe<Orders_Orders_Bool_Exp>;
  orders_aggregate?: InputMaybe<Orders_Orders_Aggregate_Bool_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  refresh_tokens?: InputMaybe<Refresh_Tokens_Bool_Exp>;
  refresh_tokens_aggregate?: InputMaybe<Refresh_Tokens_Aggregate_Bool_Exp>;
  role?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'Users_pkey'
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  comments?: InputMaybe<Orders_Comments_Arr_Rel_Insert_Input>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  notifications?: InputMaybe<Orders_Notifications_Arr_Rel_Insert_Input>;
  orders?: InputMaybe<Orders_Orders_Arr_Rel_Insert_Input>;
  password?: InputMaybe<Scalars['String']['input']>;
  refresh_tokens?: InputMaybe<Refresh_Tokens_Arr_Rel_Insert_Input>;
  role?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  comments_aggregate?: InputMaybe<Orders_Comments_Aggregate_Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Orders_Notifications_Aggregate_Order_By>;
  orders_aggregate?: InputMaybe<Orders_Orders_Aggregate_Order_By>;
  password?: InputMaybe<Order_By>;
  refresh_tokens_aggregate?: InputMaybe<Refresh_Tokens_Aggregate_Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Password = 'password',
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: 'users_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: 'users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: 'users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: 'users_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Password = 'password',
  /** column name */
  Role = 'role'
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: 'users_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: 'users_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: 'users_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  role?: Maybe<Scalars['Float']['output']>;
};

export type GetNotificationsSubscriptionVariables = Exact<{
  _eq: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNotificationsSubscription = { __typename?: 'subscription_root', orders_notifications: Array<{ __typename?: 'orders_notifications', id: number, seen: boolean, comment: { __typename?: 'orders_comments', id: number, text: string, created_at: any, user: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } }, order?: { __typename?: 'orders_orders', id: number, city?: string | null, contractor?: string | null } | null }> };

export type UpdateNotificationSeenMutationVariables = Exact<{
  ID: Scalars['Int']['input'];
  Seen: Scalars['Boolean']['input'];
}>;


export type UpdateNotificationSeenMutation = { __typename?: 'mutation_root', update_orders_notifications_by_pk?: { __typename?: 'orders_notifications', id: number, seen: boolean } | null };

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

export type GetDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDetailsQuery = { __typename?: 'query_root', metal_flow_details: Array<{ __typename?: 'metal_flow_details', id: number, name: string, detail_materials: Array<{ __typename?: 'metal_flow_detail_materials', data?: any | null, material: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } }> }> };

export type GetDetailByPkQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetDetailByPkQuery = { __typename?: 'query_root', metal_flow_details_by_pk?: { __typename?: 'metal_flow_details', id: number, name: string, detail_materials: Array<{ __typename?: 'metal_flow_detail_materials', data?: any | null, material: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } }> } | null };

export type InsertDetailMutationVariables = Exact<{
  object: Metal_Flow_Details_Insert_Input;
}>;


export type InsertDetailMutation = { __typename?: 'mutation_root', insert_metal_flow_details_one?: { __typename?: 'metal_flow_details', id: number, name: string } | null };

export type UpdateDetailMutationVariables = Exact<{
  _set: Metal_Flow_Details_Set_Input;
  id: Scalars['Int']['input'];
}>;


export type UpdateDetailMutation = { __typename?: 'mutation_root', update_metal_flow_details_by_pk?: { __typename?: 'metal_flow_details', id: number } | null };

export type UpdateDetailMaterialRelationDataMutationVariables = Exact<{
  detail_id: Scalars['Int']['input'];
  material_id: Scalars['Int']['input'];
  data: Scalars['jsonb']['input'];
}>;


export type UpdateDetailMaterialRelationDataMutation = { __typename?: 'mutation_root', update_metal_flow_detail_materials_by_pk?: { __typename?: 'metal_flow_detail_materials', data?: any | null } | null };

export type DeleteDetailMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteDetailMutation = { __typename?: 'mutation_root', delete_metal_flow_details_by_pk?: { __typename?: 'metal_flow_details', id: number } | null };

export type GetDetailMaterialsQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetDetailMaterialsQuery = { __typename?: 'query_root', metal_flow_detail_materials: Array<{ __typename?: 'metal_flow_detail_materials', material: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } }> };

export type GetDetailsMadeFromThatMaterialQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetDetailsMadeFromThatMaterialQuery = { __typename?: 'query_root', metal_flow_detail_materials: Array<{ __typename?: 'metal_flow_detail_materials', detail: { __typename?: 'metal_flow_details', id: number, name: string } }> };

export type InsertDetailMaterialsMutationVariables = Exact<{
  objects: Array<Metal_Flow_Detail_Materials_Insert_Input> | Metal_Flow_Detail_Materials_Insert_Input;
}>;


export type InsertDetailMaterialsMutation = { __typename?: 'mutation_root', insert_metal_flow_detail_materials?: { __typename?: 'metal_flow_detail_materials_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'metal_flow_detail_materials', detail_id: number, material_id: number }> } | null };

export type MaterialFragmentFragment = { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string };

export type GetMaterialsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMaterialsQuery = { __typename?: 'query_root', metal_flow_materials: Array<{ __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string }> };

export type GetMaterialByPkQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMaterialByPkQuery = { __typename?: 'query_root', metal_flow_materials_by_pk?: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } | null };

export type GetPossibleAlloysQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPossibleAlloysQuery = { __typename?: 'query_root', metal_flow_materials: Array<{ __typename?: 'metal_flow_materials', shape_data?: any | null }> };

export type InsertMaterialMutationVariables = Exact<{
  object: Metal_Flow_Materials_Insert_Input;
}>;


export type InsertMaterialMutation = { __typename?: 'mutation_root', insert_metal_flow_materials_one?: { __typename?: 'metal_flow_materials', id: number } | null };

export type UpdateMaterialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  _set: Metal_Flow_Materials_Set_Input;
}>;


export type UpdateMaterialMutation = { __typename?: 'mutation_root', update_metal_flow_materials_by_pk?: { __typename?: 'metal_flow_materials', id: number } | null };

export type DeleteMaterialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteMaterialMutation = { __typename?: 'mutation_root', delete_metal_flow_materials_by_pk?: { __typename?: 'metal_flow_materials', id: number } | null };

export type InsertMaterialSupplyMutationVariables = Exact<{
  object: Metal_Flow_Supplies_Insert_Input;
}>;


export type InsertMaterialSupplyMutation = { __typename?: 'mutation_root', insert_metal_flow_supplies_one?: { __typename?: 'metal_flow_supplies', id: number } | null };

export type GetSuppliesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSuppliesQuery = { __typename?: 'query_root', metal_flow_supplies: Array<{ __typename?: 'metal_flow_supplies', id: number, material_id?: number | null, qty: any, supplied_at: any, supplier_name: string, material?: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } | null }> };

export type DeleteSupplyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSupplyMutation = { __typename?: 'mutation_root', delete_metal_flow_supplies_by_pk?: { __typename?: 'metal_flow_supplies', id: number } | null };

export type InsertMaterialWriteoffMutationVariables = Exact<{
  objects: Array<Metal_Flow_Writeoffs_Insert_Input> | Metal_Flow_Writeoffs_Insert_Input;
}>;


export type InsertMaterialWriteoffMutation = { __typename?: 'mutation_root', insert_metal_flow_writeoffs?: { __typename?: 'metal_flow_writeoffs_mutation_response', affected_rows: number } | null };

export type GetWrietOffsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWrietOffsQuery = { __typename?: 'query_root', metal_flow_writeoffs: Array<{ __typename?: 'metal_flow_writeoffs', id: number, date: any, qty: any, type: number, type_data: any, reason: number, material: { __typename?: 'metal_flow_materials', id: number, unit: number, shape: number, shape_data?: any | null, label: string } }> };

export type DeleteWriteOffMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteWriteOffMutation = { __typename?: 'mutation_root', delete_metal_flow_writeoffs_by_pk?: { __typename?: 'metal_flow_writeoffs', id: number } | null };

export type CommentsSubscriptionVariables = Exact<{
  OrderID: Scalars['Int']['input'];
}>;


export type CommentsSubscription = { __typename?: 'subscription_root', orders_comments: Array<{ __typename?: 'orders_comments', id: number, text: string, created_at: any, user: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } }> };

export type InsertCommentMutationVariables = Exact<{
  OrderID: Scalars['Int']['input'];
  Text: Scalars['String']['input'];
  UserID: Scalars['Int']['input'];
}>;


export type InsertCommentMutation = { __typename?: 'mutation_root', insert_orders_comments_one?: { __typename?: 'orders_comments', id: number, order_id: number, text: string, created_at: any, user_id: number } | null };

export type DeleteCommentMutationVariables = Exact<{
  CommentID: Scalars['Int']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'mutation_root', delete_orders_comments_by_pk?: { __typename?: 'orders_comments', id: number } | null };

export type UpdateCommentMutationVariables = Exact<{
  CommentID: Scalars['Int']['input'];
  Text: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'mutation_root', update_orders_comments_by_pk?: { __typename?: 'orders_comments', id: number, order_id: number, text: string, created_at: any, user_id: number } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', first_name?: string | null, last_name?: string | null, id: number, role: number }> };

export type GetOrderPaymentsQueryVariables = Exact<{
  _eq: Scalars['Int']['input'];
}>;


export type GetOrderPaymentsQuery = { __typename?: 'query_root', orders_order_payments: Array<{ __typename?: 'orders_order_payments', date: any, id: number, amount: any }> };

export type InsertNotificationMutationVariables = Exact<{
  comment_id: Scalars['Int']['input'];
  user_id: Scalars['Int']['input'];
  order_id: Scalars['Int']['input'];
}>;


export type InsertNotificationMutation = { __typename?: 'mutation_root', insert_orders_notifications?: { __typename?: 'orders_notifications_mutation_response', returning: Array<{ __typename?: 'orders_notifications', user_id?: number | null, id: number }> } | null };

export type InsertDocumentsArrayMutationVariables = Exact<{
  objects: Array<Orders_Attachments_Insert_Input> | Orders_Attachments_Insert_Input;
}>;


export type InsertDocumentsArrayMutation = { __typename?: 'mutation_root', insert_orders_attachments?: { __typename?: 'orders_attachments_mutation_response', returning: Array<{ __typename?: 'orders_attachments', id: number }> } | null };

export type InsertPaymentMutationVariables = Exact<{
  amount: Scalars['numeric']['input'];
  date: Scalars['timestamp']['input'];
  order_id: Scalars['Int']['input'];
}>;


export type InsertPaymentMutation = { __typename?: 'mutation_root', insert_orders_order_payments_one?: { __typename?: 'orders_order_payments', id: number, order_id: number } | null };

export type DeletePaymentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeletePaymentMutation = { __typename?: 'mutation_root', delete_orders_order_payments_by_pk?: { __typename?: 'orders_order_payments', id: number } | null };

export type DeleteOrderMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteOrderMutation = { __typename?: 'mutation_root', delete_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number } | null };

export type InsertOrderItemMutationVariables = Exact<{
  name: Scalars['String']['input'];
  order_id: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  description: Scalars['String']['input'];
}>;


export type InsertOrderItemMutation = { __typename?: 'mutation_root', insert_orders_order_items_one?: { __typename?: 'orders_order_items', id: number, order_id: number } | null };

export type DeleteOrderItemByPkMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteOrderItemByPkMutation = { __typename?: 'mutation_root', delete_orders_order_items_by_pk?: { __typename?: 'orders_order_items', id: number } | null };

export type UpdateOrderItemByPkMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  _set: Orders_Order_Items_Set_Input;
}>;


export type UpdateOrderItemByPkMutation = { __typename?: 'mutation_root', update_orders_order_items_by_pk?: { __typename?: 'orders_order_items', id: number } | null };

export type MoveOrderToPriorityMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  acceptance_date: Scalars['timestamp']['input'];
}>;


export type MoveOrderToPriorityMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, status: number } | null };

export type MoveOrderToArchiveMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  actual_shipping_date: Scalars['timestamp']['input'];
  status: Scalars['Int']['input'];
}>;


export type MoveOrderToArchiveMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, status: number } | null };

export type UpdateNeedAttentionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  need_attention: Scalars['String']['input'];
}>;


export type UpdateNeedAttentionMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, need_attention?: string | null } | null };

export type UpdateAwaitingDispatchMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  awaiting_dispatch: Scalars['Boolean']['input'];
}>;


export type UpdateAwaitingDispatchMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, awaiting_dispatch: boolean } | null };

export type UpdateOrderInfoMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  fields?: InputMaybe<Orders_Orders_Set_Input>;
}>;


export type UpdateOrderInfoMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, contractor?: string | null, city?: string | null, created_at: any } | null };

export type GetOrdersByStatusQueryVariables = Exact<{
  shipping_date?: InputMaybe<Order_By>;
  order_status: Scalars['Int']['input'];
}>;


export type GetOrdersByStatusQuery = { __typename?: 'query_root', orders_orders: Array<{ __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> }> };

export type GetOrdersArchivedBySearchKeywordQueryVariables = Exact<{
  keyword: Scalars['String']['input'];
  order_status: Scalars['Int']['input'];
}>;


export type GetOrdersArchivedBySearchKeywordQuery = { __typename?: 'query_root', orders_orders: Array<{ __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> }> };

export type GetOrdersArchivedByIntervalQueryVariables = Exact<{
  _lte: Scalars['timestamp']['input'];
  _gte: Scalars['timestamp']['input'];
}>;


export type GetOrdersArchivedByIntervalQuery = { __typename?: 'query_root', orders_orders: Array<{ __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> }> };

export type GetManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetManagersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', first_name?: string | null, last_name?: string | null, id: number, role: number }> };

export type GetOrderByPkQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetOrderByPkQuery = { __typename?: 'query_root', orders_orders: Array<{ __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> }> };

export type GetOrderAttachmentsQueryVariables = Exact<{
  order_id: Scalars['Int']['input'];
}>;


export type GetOrderAttachmentsQuery = { __typename?: 'query_root', orders_attachments: Array<{ __typename?: 'orders_attachments', filename?: string | null, id: number, key: string, size?: number | null }> };

export type InsertOrderMutationVariables = Exact<{
  status: Scalars['Int']['input'];
}>;


export type InsertOrderMutation = { __typename?: 'mutation_root', insert_orders_orders?: { __typename?: 'orders_orders_mutation_response', returning: Array<{ __typename?: 'orders_orders', id: number }> } | null };

export type OrderFragment = { __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> };

export type GetReclamationOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReclamationOrdersQuery = { __typename?: 'query_root', orders_orders: Array<{ __typename?: 'orders_orders', id: number, status: number, city?: string | null, contractor?: string | null, invoice_number?: string | null, total_amount?: any | null, order_number?: string | null, need_attention?: string | null, awaiting_dispatch: boolean, actual_shipping_date?: any | null, acceptance_date?: any | null, shipping_date?: any | null, created_at: any, manager_id?: number | null, comment?: string | null, user?: { __typename?: 'users', id: number, first_name?: string | null, last_name?: string | null } | null, order_items: Array<{ __typename?: 'orders_order_items', id: number, name: string, description?: string | null, quantity: number }>, order_payments: Array<{ __typename?: 'orders_order_payments', id: number, amount: any, date: any }> }> };

export type UpdateOrderStatusMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  status: Scalars['Int']['input'];
}>;


export type UpdateOrderStatusMutation = { __typename?: 'mutation_root', update_orders_orders_by_pk?: { __typename?: 'orders_orders', id: number, status: number } | null };

export const MaterialFragmentFragmentDoc = gql`
    fragment MaterialFragment on metal_flow_materials {
  id
  unit
  shape
  shape_data
  label
}
    `;
export const OrderFragmentDoc = gql`
    fragment Order on orders_orders {
  id
  status
  city
  contractor
  invoice_number
  total_amount
  order_number
  need_attention
  awaiting_dispatch
  actual_shipping_date
  acceptance_date
  shipping_date
  created_at
  manager_id
  comment
  user {
    id
    first_name
    last_name
  }
  order_items(order_by: {id: asc}) {
    id
    name
    description
    quantity
  }
  order_payments(where: {amount: {_neq: 0}}) {
    id
    amount
    date
  }
}
    `;
export const GetNotificationsDocument = gql`
    subscription GetNotifications($_eq: Int!, $limit: Int) {
  orders_notifications(
    where: {user_id: {_eq: $_eq}}
    limit: $limit
    order_by: {id: desc}
  ) {
    id
    seen
    comment {
      id
      text
      created_at
      user {
        id
        first_name
        last_name
      }
    }
    order {
      id
      city
      contractor
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
export const UpdateNotificationSeenDocument = gql`
    mutation UpdateNotificationSeen($ID: Int!, $Seen: Boolean!) {
  update_orders_notifications_by_pk(pk_columns: {id: $ID}, _set: {seen: $Seen}) {
    id
    seen
  }
}
    `;
export type UpdateNotificationSeenMutationFn = Apollo.MutationFunction<UpdateNotificationSeenMutation, UpdateNotificationSeenMutationVariables>;

/**
 * __useUpdateNotificationSeenMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationSeenMutation, { data, loading, error }] = useUpdateNotificationSeenMutation({
 *   variables: {
 *      ID: // value for 'ID'
 *      Seen: // value for 'Seen'
 *   },
 * });
 */
export function useUpdateNotificationSeenMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationSeenMutation, UpdateNotificationSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNotificationSeenMutation, UpdateNotificationSeenMutationVariables>(UpdateNotificationSeenDocument, options);
      }
export type UpdateNotificationSeenMutationHookResult = ReturnType<typeof useUpdateNotificationSeenMutation>;
export type UpdateNotificationSeenMutationResult = Apollo.MutationResult<UpdateNotificationSeenMutation>;
export type UpdateNotificationSeenMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationSeenMutation, UpdateNotificationSeenMutationVariables>;
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
export const GetDetailsDocument = gql`
    query GetDetails {
  metal_flow_details {
    id
    name
    detail_materials {
      data
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
  metal_flow_details_by_pk(id: $id) {
    id
    name
    detail_materials {
      data
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
    mutation InsertDetail($object: metal_flow_details_insert_input!) {
  insert_metal_flow_details_one(object: $object) {
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
    mutation UpdateDetail($_set: metal_flow_details_set_input!, $id: Int!) {
  update_metal_flow_details_by_pk(pk_columns: {id: $id}, _set: $_set) {
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
export const UpdateDetailMaterialRelationDataDocument = gql`
    mutation UpdateDetailMaterialRelationData($detail_id: Int!, $material_id: Int!, $data: jsonb!) {
  update_metal_flow_detail_materials_by_pk(
    pk_columns: {detail_id: $detail_id, material_id: $material_id}
    _set: {data: $data}
  ) {
    data
  }
}
    `;
export type UpdateDetailMaterialRelationDataMutationFn = Apollo.MutationFunction<UpdateDetailMaterialRelationDataMutation, UpdateDetailMaterialRelationDataMutationVariables>;

/**
 * __useUpdateDetailMaterialRelationDataMutation__
 *
 * To run a mutation, you first call `useUpdateDetailMaterialRelationDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDetailMaterialRelationDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDetailMaterialRelationDataMutation, { data, loading, error }] = useUpdateDetailMaterialRelationDataMutation({
 *   variables: {
 *      detail_id: // value for 'detail_id'
 *      material_id: // value for 'material_id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateDetailMaterialRelationDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDetailMaterialRelationDataMutation, UpdateDetailMaterialRelationDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDetailMaterialRelationDataMutation, UpdateDetailMaterialRelationDataMutationVariables>(UpdateDetailMaterialRelationDataDocument, options);
      }
export type UpdateDetailMaterialRelationDataMutationHookResult = ReturnType<typeof useUpdateDetailMaterialRelationDataMutation>;
export type UpdateDetailMaterialRelationDataMutationResult = Apollo.MutationResult<UpdateDetailMaterialRelationDataMutation>;
export type UpdateDetailMaterialRelationDataMutationOptions = Apollo.BaseMutationOptions<UpdateDetailMaterialRelationDataMutation, UpdateDetailMaterialRelationDataMutationVariables>;
export const DeleteDetailDocument = gql`
    mutation DeleteDetail($id: Int!) {
  delete_metal_flow_details_by_pk(id: $id) {
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
  metal_flow_detail_materials(where: {material_id: {_eq: $_eq}}) {
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
  metal_flow_detail_materials(where: {material_id: {_eq: $_eq}}) {
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
    mutation InsertDetailMaterials($objects: [metal_flow_detail_materials_insert_input!]!) {
  insert_metal_flow_detail_materials(
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
  metal_flow_materials {
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
  metal_flow_materials_by_pk(id: $id) {
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
export const GetPossibleAlloysDocument = gql`
    query GetPossibleAlloys {
  metal_flow_materials {
    shape_data(path: "alloy")
  }
}
    `;

/**
 * __useGetPossibleAlloysQuery__
 *
 * To run a query within a React component, call `useGetPossibleAlloysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPossibleAlloysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPossibleAlloysQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPossibleAlloysQuery(baseOptions?: Apollo.QueryHookOptions<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>(GetPossibleAlloysDocument, options);
      }
export function useGetPossibleAlloysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>(GetPossibleAlloysDocument, options);
        }
export function useGetPossibleAlloysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>(GetPossibleAlloysDocument, options);
        }
export type GetPossibleAlloysQueryHookResult = ReturnType<typeof useGetPossibleAlloysQuery>;
export type GetPossibleAlloysLazyQueryHookResult = ReturnType<typeof useGetPossibleAlloysLazyQuery>;
export type GetPossibleAlloysSuspenseQueryHookResult = ReturnType<typeof useGetPossibleAlloysSuspenseQuery>;
export type GetPossibleAlloysQueryResult = Apollo.QueryResult<GetPossibleAlloysQuery, GetPossibleAlloysQueryVariables>;
export const InsertMaterialDocument = gql`
    mutation InsertMaterial($object: metal_flow_materials_insert_input!) {
  insert_metal_flow_materials_one(object: $object) {
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
    mutation UpdateMaterial($id: Int!, $_set: metal_flow_materials_set_input!) {
  update_metal_flow_materials_by_pk(pk_columns: {id: $id}, _set: $_set) {
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
  delete_metal_flow_materials_by_pk(id: $id) {
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
    mutation InsertMaterialSupply($object: metal_flow_supplies_insert_input!) {
  insert_metal_flow_supplies_one(object: $object) {
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
  metal_flow_supplies(order_by: {id: desc}) {
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
  delete_metal_flow_supplies_by_pk(id: $id) {
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
    mutation InsertMaterialWriteoff($objects: [metal_flow_writeoffs_insert_input!]!) {
  insert_metal_flow_writeoffs(objects: $objects) {
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
  metal_flow_writeoffs(order_by: {id: desc}) {
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
  delete_metal_flow_writeoffs_by_pk(id: $id) {
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
export const CommentsDocument = gql`
    subscription Comments($OrderID: Int!) {
  orders_comments(where: {order_id: {_eq: $OrderID}}, order_by: {id: desc}) {
    id
    text
    created_at
    user {
      id
      first_name
      last_name
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
  insert_orders_comments_one(
    object: {order_id: $OrderID, text: $Text, user_id: $UserID}
  ) {
    id
    order_id
    text
    created_at
    user_id
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
  delete_orders_comments_by_pk(id: $CommentID) {
    id
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
  update_orders_comments_by_pk(pk_columns: {id: $CommentID}, _set: {text: $Text}) {
    id
    order_id
    text
    created_at
    user_id
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
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  users {
    first_name
    last_name
    id
    role
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
  orders_order_payments(where: {order_id: {_eq: $_eq}}, order_by: {date: asc}) {
    date
    id
    amount
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
    mutation InsertNotification($comment_id: Int!, $user_id: Int!, $order_id: Int!) {
  insert_orders_notifications(
    objects: {comment_id: $comment_id, user_id: $user_id, order_id: $order_id}
  ) {
    returning {
      user_id
      id
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
 *      comment_id: // value for 'comment_id'
 *      user_id: // value for 'user_id'
 *      order_id: // value for 'order_id'
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
    mutation InsertDocumentsArray($objects: [orders_attachments_insert_input!]!) {
  insert_orders_attachments(objects: $objects) {
    returning {
      id
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
    mutation InsertPayment($amount: numeric!, $date: timestamp!, $order_id: Int!) {
  insert_orders_order_payments_one(
    object: {amount: $amount, order_id: $order_id, date: $date}
  ) {
    id
    order_id
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
 *      amount: // value for 'amount'
 *      date: // value for 'date'
 *      order_id: // value for 'order_id'
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
    mutation DeletePayment($id: Int!) {
  delete_orders_order_payments_by_pk(id: $id) {
    id
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
 *      id: // value for 'id'
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
    mutation DeleteOrder($id: Int!) {
  delete_orders_orders_by_pk(id: $id) {
    id
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
 *      id: // value for 'id'
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
    mutation InsertOrderItem($name: String!, $order_id: Int!, $quantity: Int!, $description: String!) {
  insert_orders_order_items_one(
    object: {order_id: $order_id, name: $name, description: $description, quantity: $quantity}
  ) {
    id
    order_id
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
 *      order_id: // value for 'order_id'
 *      quantity: // value for 'quantity'
 *      description: // value for 'description'
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
  delete_orders_order_items_by_pk(id: $id) {
    id
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
    mutation UpdateOrderItemByPk($id: Int!, $_set: orders_order_items_set_input!) {
  update_orders_order_items_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
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
 *      _set: // value for '_set'
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
    mutation MoveOrderToPriority($id: Int!, $acceptance_date: timestamp!) {
  update_orders_orders_by_pk(
    pk_columns: {id: $id}
    _set: {status: 2, acceptance_date: $acceptance_date}
  ) {
    id
    status
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
 *      id: // value for 'id'
 *      acceptance_date: // value for 'acceptance_date'
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
    mutation MoveOrderToArchive($id: Int!, $actual_shipping_date: timestamp!, $status: Int!) {
  update_orders_orders_by_pk(
    pk_columns: {id: $id}
    _set: {status: $status, awaiting_dispatch: false, actual_shipping_date: $actual_shipping_date}
  ) {
    id
    status
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
 *      id: // value for 'id'
 *      actual_shipping_date: // value for 'actual_shipping_date'
 *      status: // value for 'status'
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
    mutation UpdateNeedAttention($id: Int!, $need_attention: String!) {
  update_orders_orders_by_pk(
    pk_columns: {id: $id}
    _set: {need_attention: $need_attention}
  ) {
    id
    need_attention
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
 *      id: // value for 'id'
 *      need_attention: // value for 'need_attention'
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
    mutation UpdateAwaitingDispatch($id: Int!, $awaiting_dispatch: Boolean!) {
  update_orders_orders_by_pk(
    pk_columns: {id: $id}
    _set: {awaiting_dispatch: $awaiting_dispatch}
  ) {
    id
    awaiting_dispatch
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
 *      id: // value for 'id'
 *      awaiting_dispatch: // value for 'awaiting_dispatch'
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
    mutation UpdateOrderInfo($id: Int!, $fields: orders_orders_set_input) {
  update_orders_orders_by_pk(pk_columns: {id: $id}, _set: $fields) {
    id
    contractor
    city
    created_at
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
 *      id: // value for 'id'
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
    query getOrdersByStatus($shipping_date: order_by = asc_nulls_first, $order_status: Int!) {
  orders_orders(
    where: {status: {_eq: $order_status}}
    order_by: {shipping_date: $shipping_date}
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
 *      shipping_date: // value for 'shipping_date'
 *      order_status: // value for 'order_status'
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
    query getOrdersArchivedBySearchKeyword($keyword: String!, $order_status: Int!) {
  orders_orders(
    order_by: {actual_shipping_date: desc_nulls_last}
    where: {_or: [{contractor: {_ilike: $keyword}}, {invoice_number: {_ilike: $keyword, _is_null: false}}], status: {_eq: $order_status}}
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
 *      order_status: // value for 'order_status'
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
  orders_orders(
    where: {actual_shipping_date: {_lte: $_lte, _gte: $_gte}}
    order_by: {actual_shipping_date: asc}
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
  users(where: {role: {_lte: 2}}) {
    first_name
    last_name
    id
    role
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
    query GetOrderByPK($id: Int!) {
  orders_orders(where: {id: {_eq: $id}}) {
    ...Order
  }
}
    ${OrderFragmentDoc}`;

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
 *      id: // value for 'id'
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
export const GetOrderAttachmentsDocument = gql`
    query GetOrderAttachments($order_id: Int!) {
  orders_attachments(where: {order_id: {_eq: $order_id}}) {
    filename
    id
    key
    size
  }
}
    `;

/**
 * __useGetOrderAttachmentsQuery__
 *
 * To run a query within a React component, call `useGetOrderAttachmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderAttachmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderAttachmentsQuery({
 *   variables: {
 *      order_id: // value for 'order_id'
 *   },
 * });
 */
export function useGetOrderAttachmentsQuery(baseOptions: Apollo.QueryHookOptions<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables> & ({ variables: GetOrderAttachmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>(GetOrderAttachmentsDocument, options);
      }
export function useGetOrderAttachmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>(GetOrderAttachmentsDocument, options);
        }
export function useGetOrderAttachmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>(GetOrderAttachmentsDocument, options);
        }
export type GetOrderAttachmentsQueryHookResult = ReturnType<typeof useGetOrderAttachmentsQuery>;
export type GetOrderAttachmentsLazyQueryHookResult = ReturnType<typeof useGetOrderAttachmentsLazyQuery>;
export type GetOrderAttachmentsSuspenseQueryHookResult = ReturnType<typeof useGetOrderAttachmentsSuspenseQuery>;
export type GetOrderAttachmentsQueryResult = Apollo.QueryResult<GetOrderAttachmentsQuery, GetOrderAttachmentsQueryVariables>;
export const InsertOrderDocument = gql`
    mutation InsertOrder($status: Int!) {
  insert_orders_orders(objects: {status: $status}) {
    returning {
      id
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
 *      status: // value for 'status'
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
  orders_orders(where: {status: {_in: [10, 11, 12]}}) {
    ...Order
  }
}
    ${OrderFragmentDoc}`;

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
    mutation UpdateOrderStatus($id: Int!, $status: Int!) {
  update_orders_orders_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
    id
    status
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
 *      id: // value for 'id'
 *      status: // value for 'status'
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