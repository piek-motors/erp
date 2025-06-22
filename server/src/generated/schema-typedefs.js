import { gql } from 'graphql-tag';
/** unique or primary key constraints on table "attachments" */
export var Attachments_Constraint;
(function (Attachments_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Attachments_Constraint["AttachmentsPkey"] = "attachments_pkey";
})(Attachments_Constraint || (Attachments_Constraint = {}));
/** select columns of table "attachments" */
export var Attachments_Select_Column;
(function (Attachments_Select_Column) {
    /** column name */
    Attachments_Select_Column["Filename"] = "filename";
    /** column name */
    Attachments_Select_Column["Id"] = "id";
    /** column name */
    Attachments_Select_Column["Key"] = "key";
    /** column name */
    Attachments_Select_Column["Size"] = "size";
    /** column name */
    Attachments_Select_Column["UploadedAt"] = "uploaded_at";
})(Attachments_Select_Column || (Attachments_Select_Column = {}));
/** update columns of table "attachments" */
export var Attachments_Update_Column;
(function (Attachments_Update_Column) {
    /** column name */
    Attachments_Update_Column["Filename"] = "filename";
    /** column name */
    Attachments_Update_Column["Id"] = "id";
    /** column name */
    Attachments_Update_Column["Key"] = "key";
    /** column name */
    Attachments_Update_Column["Size"] = "size";
    /** column name */
    Attachments_Update_Column["UploadedAt"] = "uploaded_at";
})(Attachments_Update_Column || (Attachments_Update_Column = {}));
/** unique or primary key constraints on table "attendance.config" */
export var Attendance_Config_Constraint;
(function (Attendance_Config_Constraint) {
    /** unique or primary key constraint on columns "ID" */
    Attendance_Config_Constraint["ConfigPkey"] = "config_pkey";
})(Attendance_Config_Constraint || (Attendance_Config_Constraint = {}));
/** select columns of table "attendance.config" */
export var Attendance_Config_Select_Column;
(function (Attendance_Config_Select_Column) {
    /** column name */
    Attendance_Config_Select_Column["Id"] = "ID";
    /** column name */
    Attendance_Config_Select_Column["TimeDeduction"] = "TimeDeduction";
})(Attendance_Config_Select_Column || (Attendance_Config_Select_Column = {}));
/** update columns of table "attendance.config" */
export var Attendance_Config_Update_Column;
(function (Attendance_Config_Update_Column) {
    /** column name */
    Attendance_Config_Update_Column["Id"] = "ID";
    /** column name */
    Attendance_Config_Update_Column["TimeDeduction"] = "TimeDeduction";
})(Attendance_Config_Update_Column || (Attendance_Config_Update_Column = {}));
/** unique or primary key constraints on table "attendance.intervals" */
export var Attendance_Intervals_Constraint;
(function (Attendance_Intervals_Constraint) {
    /** unique or primary key constraint on columns "ent_event_id" */
    Attendance_Intervals_Constraint["EntEventId"] = "ent_event_id";
    /** unique or primary key constraint on columns "card", "ent_event_id" */
    Attendance_Intervals_Constraint["IntervalsPkey"] = "intervals_pkey";
})(Attendance_Intervals_Constraint || (Attendance_Intervals_Constraint = {}));
/** select columns of table "attendance.intervals" */
export var Attendance_Intervals_Select_Column;
(function (Attendance_Intervals_Select_Column) {
    /** column name */
    Attendance_Intervals_Select_Column["Card"] = "card";
    /** column name */
    Attendance_Intervals_Select_Column["Database"] = "database";
    /** column name */
    Attendance_Intervals_Select_Column["Ent"] = "ent";
    /** column name */
    Attendance_Intervals_Select_Column["EntEventId"] = "ent_event_id";
    /** column name */
    Attendance_Intervals_Select_Column["Ext"] = "ext";
    /** column name */
    Attendance_Intervals_Select_Column["ExtEventId"] = "ext_event_id";
})(Attendance_Intervals_Select_Column || (Attendance_Intervals_Select_Column = {}));
/** update columns of table "attendance.intervals" */
export var Attendance_Intervals_Update_Column;
(function (Attendance_Intervals_Update_Column) {
    /** column name */
    Attendance_Intervals_Update_Column["Card"] = "card";
    /** column name */
    Attendance_Intervals_Update_Column["Database"] = "database";
    /** column name */
    Attendance_Intervals_Update_Column["Ent"] = "ent";
    /** column name */
    Attendance_Intervals_Update_Column["EntEventId"] = "ent_event_id";
    /** column name */
    Attendance_Intervals_Update_Column["Ext"] = "ext";
    /** column name */
    Attendance_Intervals_Update_Column["ExtEventId"] = "ext_event_id";
})(Attendance_Intervals_Update_Column || (Attendance_Intervals_Update_Column = {}));
/** unique or primary key constraints on table "attendance.users" */
export var Attendance_Users_Constraint;
(function (Attendance_Users_Constraint) {
    /** unique or primary key constraint on columns "card" */
    Attendance_Users_Constraint["UniqueCard"] = "unique_card";
    /** unique or primary key constraint on columns "card" */
    Attendance_Users_Constraint["UsersCardKey"] = "users_card_key";
    /** unique or primary key constraint on columns "id" */
    Attendance_Users_Constraint["UsersPkey"] = "users_pkey";
})(Attendance_Users_Constraint || (Attendance_Users_Constraint = {}));
/** select columns of table "attendance.users" */
export var Attendance_Users_Select_Column;
(function (Attendance_Users_Select_Column) {
    /** column name */
    Attendance_Users_Select_Column["Card"] = "card";
    /** column name */
    Attendance_Users_Select_Column["CreatedAt"] = "created_at";
    /** column name */
    Attendance_Users_Select_Column["Firstname"] = "firstname";
    /** column name */
    Attendance_Users_Select_Column["Id"] = "id";
    /** column name */
    Attendance_Users_Select_Column["Lastname"] = "lastname";
})(Attendance_Users_Select_Column || (Attendance_Users_Select_Column = {}));
/** update columns of table "attendance.users" */
export var Attendance_Users_Update_Column;
(function (Attendance_Users_Update_Column) {
    /** column name */
    Attendance_Users_Update_Column["Card"] = "card";
    /** column name */
    Attendance_Users_Update_Column["CreatedAt"] = "created_at";
    /** column name */
    Attendance_Users_Update_Column["Firstname"] = "firstname";
    /** column name */
    Attendance_Users_Update_Column["Id"] = "id";
    /** column name */
    Attendance_Users_Update_Column["Lastname"] = "lastname";
})(Attendance_Users_Update_Column || (Attendance_Users_Update_Column = {}));
/** ordering argument of a cursor */
export var Cursor_Ordering;
(function (Cursor_Ordering) {
    /** ascending ordering of the cursor */
    Cursor_Ordering["Asc"] = "ASC";
    /** descending ordering of the cursor */
    Cursor_Ordering["Desc"] = "DESC";
})(Cursor_Ordering || (Cursor_Ordering = {}));
/** unique or primary key constraints on table "kysely_migration" */
export var Kysely_Migration_Constraint;
(function (Kysely_Migration_Constraint) {
    /** unique or primary key constraint on columns "name" */
    Kysely_Migration_Constraint["KyselyMigrationPkey"] = "kysely_migration_pkey";
})(Kysely_Migration_Constraint || (Kysely_Migration_Constraint = {}));
/** unique or primary key constraints on table "kysely_migration_lock" */
export var Kysely_Migration_Lock_Constraint;
(function (Kysely_Migration_Lock_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Kysely_Migration_Lock_Constraint["KyselyMigrationLockPkey"] = "kysely_migration_lock_pkey";
})(Kysely_Migration_Lock_Constraint || (Kysely_Migration_Lock_Constraint = {}));
/** select columns of table "kysely_migration_lock" */
export var Kysely_Migration_Lock_Select_Column;
(function (Kysely_Migration_Lock_Select_Column) {
    /** column name */
    Kysely_Migration_Lock_Select_Column["Id"] = "id";
    /** column name */
    Kysely_Migration_Lock_Select_Column["IsLocked"] = "is_locked";
})(Kysely_Migration_Lock_Select_Column || (Kysely_Migration_Lock_Select_Column = {}));
/** update columns of table "kysely_migration_lock" */
export var Kysely_Migration_Lock_Update_Column;
(function (Kysely_Migration_Lock_Update_Column) {
    /** column name */
    Kysely_Migration_Lock_Update_Column["Id"] = "id";
    /** column name */
    Kysely_Migration_Lock_Update_Column["IsLocked"] = "is_locked";
})(Kysely_Migration_Lock_Update_Column || (Kysely_Migration_Lock_Update_Column = {}));
/** select columns of table "kysely_migration" */
export var Kysely_Migration_Select_Column;
(function (Kysely_Migration_Select_Column) {
    /** column name */
    Kysely_Migration_Select_Column["Name"] = "name";
    /** column name */
    Kysely_Migration_Select_Column["Timestamp"] = "timestamp";
})(Kysely_Migration_Select_Column || (Kysely_Migration_Select_Column = {}));
/** update columns of table "kysely_migration" */
export var Kysely_Migration_Update_Column;
(function (Kysely_Migration_Update_Column) {
    /** column name */
    Kysely_Migration_Update_Column["Name"] = "name";
    /** column name */
    Kysely_Migration_Update_Column["Timestamp"] = "timestamp";
})(Kysely_Migration_Update_Column || (Kysely_Migration_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.detail_attachments" */
export var Metal_Flow_Detail_Attachments_Constraint;
(function (Metal_Flow_Detail_Attachments_Constraint) {
    /** unique or primary key constraint on columns "attachment_id", "detail_id" */
    Metal_Flow_Detail_Attachments_Constraint["DetailAttachmentsPkey"] = "detail_attachments_pkey";
})(Metal_Flow_Detail_Attachments_Constraint || (Metal_Flow_Detail_Attachments_Constraint = {}));
/** select columns of table "metal_flow.detail_attachments" */
export var Metal_Flow_Detail_Attachments_Select_Column;
(function (Metal_Flow_Detail_Attachments_Select_Column) {
    /** column name */
    Metal_Flow_Detail_Attachments_Select_Column["AttachmentId"] = "attachment_id";
    /** column name */
    Metal_Flow_Detail_Attachments_Select_Column["DetailId"] = "detail_id";
})(Metal_Flow_Detail_Attachments_Select_Column || (Metal_Flow_Detail_Attachments_Select_Column = {}));
/** update columns of table "metal_flow.detail_attachments" */
export var Metal_Flow_Detail_Attachments_Update_Column;
(function (Metal_Flow_Detail_Attachments_Update_Column) {
    /** column name */
    Metal_Flow_Detail_Attachments_Update_Column["AttachmentId"] = "attachment_id";
    /** column name */
    Metal_Flow_Detail_Attachments_Update_Column["DetailId"] = "detail_id";
})(Metal_Flow_Detail_Attachments_Update_Column || (Metal_Flow_Detail_Attachments_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.detail_materials" */
export var Metal_Flow_Detail_Materials_Constraint;
(function (Metal_Flow_Detail_Materials_Constraint) {
    /** unique or primary key constraint on columns "material_id", "detail_id" */
    Metal_Flow_Detail_Materials_Constraint["DetailMaterialsPKey"] = "detail_materials_p_key";
})(Metal_Flow_Detail_Materials_Constraint || (Metal_Flow_Detail_Materials_Constraint = {}));
/** select columns of table "metal_flow.detail_materials" */
export var Metal_Flow_Detail_Materials_Select_Column;
(function (Metal_Flow_Detail_Materials_Select_Column) {
    /** column name */
    Metal_Flow_Detail_Materials_Select_Column["Data"] = "data";
    /** column name */
    Metal_Flow_Detail_Materials_Select_Column["DetailId"] = "detail_id";
    /** column name */
    Metal_Flow_Detail_Materials_Select_Column["MaterialId"] = "material_id";
})(Metal_Flow_Detail_Materials_Select_Column || (Metal_Flow_Detail_Materials_Select_Column = {}));
/** update columns of table "metal_flow.detail_materials" */
export var Metal_Flow_Detail_Materials_Update_Column;
(function (Metal_Flow_Detail_Materials_Update_Column) {
    /** column name */
    Metal_Flow_Detail_Materials_Update_Column["Data"] = "data";
    /** column name */
    Metal_Flow_Detail_Materials_Update_Column["DetailId"] = "detail_id";
    /** column name */
    Metal_Flow_Detail_Materials_Update_Column["MaterialId"] = "material_id";
})(Metal_Flow_Detail_Materials_Update_Column || (Metal_Flow_Detail_Materials_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.details" */
export var Metal_Flow_Details_Constraint;
(function (Metal_Flow_Details_Constraint) {
    /** unique or primary key constraint on columns "name" */
    Metal_Flow_Details_Constraint["DetailNameUniqueIdx"] = "detail_name_unique_idx";
    /** unique or primary key constraint on columns "id" */
    Metal_Flow_Details_Constraint["DetailsPkey"] = "details_pkey";
})(Metal_Flow_Details_Constraint || (Metal_Flow_Details_Constraint = {}));
/** select columns of table "metal_flow.details" */
export var Metal_Flow_Details_Select_Column;
(function (Metal_Flow_Details_Select_Column) {
    /** column name */
    Metal_Flow_Details_Select_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Details_Select_Column["Name"] = "name";
})(Metal_Flow_Details_Select_Column || (Metal_Flow_Details_Select_Column = {}));
/** update columns of table "metal_flow.details" */
export var Metal_Flow_Details_Update_Column;
(function (Metal_Flow_Details_Update_Column) {
    /** column name */
    Metal_Flow_Details_Update_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Details_Update_Column["Name"] = "name";
})(Metal_Flow_Details_Update_Column || (Metal_Flow_Details_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.materials" */
export var Metal_Flow_Materials_Constraint;
(function (Metal_Flow_Materials_Constraint) {
    /** unique or primary key constraint on columns "label" */
    Metal_Flow_Materials_Constraint["MaterialsLabelKey"] = "materials_label_key";
    /** unique or primary key constraint on columns "id" */
    Metal_Flow_Materials_Constraint["MaterialsPkey"] = "materials_pkey";
})(Metal_Flow_Materials_Constraint || (Metal_Flow_Materials_Constraint = {}));
/** select columns of table "metal_flow.materials" */
export var Metal_Flow_Materials_Select_Column;
(function (Metal_Flow_Materials_Select_Column) {
    /** column name */
    Metal_Flow_Materials_Select_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Materials_Select_Column["Label"] = "label";
    /** column name */
    Metal_Flow_Materials_Select_Column["Shape"] = "shape";
    /** column name */
    Metal_Flow_Materials_Select_Column["ShapeData"] = "shape_data";
    /** column name */
    Metal_Flow_Materials_Select_Column["Unit"] = "unit";
})(Metal_Flow_Materials_Select_Column || (Metal_Flow_Materials_Select_Column = {}));
/** update columns of table "metal_flow.materials" */
export var Metal_Flow_Materials_Update_Column;
(function (Metal_Flow_Materials_Update_Column) {
    /** column name */
    Metal_Flow_Materials_Update_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Materials_Update_Column["Label"] = "label";
    /** column name */
    Metal_Flow_Materials_Update_Column["Shape"] = "shape";
    /** column name */
    Metal_Flow_Materials_Update_Column["ShapeData"] = "shape_data";
    /** column name */
    Metal_Flow_Materials_Update_Column["Unit"] = "unit";
})(Metal_Flow_Materials_Update_Column || (Metal_Flow_Materials_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.supplies" */
export var Metal_Flow_Supplies_Constraint;
(function (Metal_Flow_Supplies_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Metal_Flow_Supplies_Constraint["SuppliesPkey"] = "supplies_pkey";
})(Metal_Flow_Supplies_Constraint || (Metal_Flow_Supplies_Constraint = {}));
/** select columns of table "metal_flow.supplies" */
export var Metal_Flow_Supplies_Select_Column;
(function (Metal_Flow_Supplies_Select_Column) {
    /** column name */
    Metal_Flow_Supplies_Select_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Supplies_Select_Column["MaterialId"] = "material_id";
    /** column name */
    Metal_Flow_Supplies_Select_Column["Qty"] = "qty";
    /** column name */
    Metal_Flow_Supplies_Select_Column["SuppliedAt"] = "supplied_at";
    /** column name */
    Metal_Flow_Supplies_Select_Column["SupplierName"] = "supplier_name";
})(Metal_Flow_Supplies_Select_Column || (Metal_Flow_Supplies_Select_Column = {}));
/** update columns of table "metal_flow.supplies" */
export var Metal_Flow_Supplies_Update_Column;
(function (Metal_Flow_Supplies_Update_Column) {
    /** column name */
    Metal_Flow_Supplies_Update_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Supplies_Update_Column["MaterialId"] = "material_id";
    /** column name */
    Metal_Flow_Supplies_Update_Column["Qty"] = "qty";
    /** column name */
    Metal_Flow_Supplies_Update_Column["SuppliedAt"] = "supplied_at";
    /** column name */
    Metal_Flow_Supplies_Update_Column["SupplierName"] = "supplier_name";
})(Metal_Flow_Supplies_Update_Column || (Metal_Flow_Supplies_Update_Column = {}));
/** unique or primary key constraints on table "metal_flow.writeoffs" */
export var Metal_Flow_Writeoffs_Constraint;
(function (Metal_Flow_Writeoffs_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Metal_Flow_Writeoffs_Constraint["WriteoffsPkey"] = "writeoffs_pkey";
})(Metal_Flow_Writeoffs_Constraint || (Metal_Flow_Writeoffs_Constraint = {}));
/** select columns of table "metal_flow.writeoffs" */
export var Metal_Flow_Writeoffs_Select_Column;
(function (Metal_Flow_Writeoffs_Select_Column) {
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["Date"] = "date";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["MaterialId"] = "material_id";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["Qty"] = "qty";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["Reason"] = "reason";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["Type"] = "type";
    /** column name */
    Metal_Flow_Writeoffs_Select_Column["TypeData"] = "type_data";
})(Metal_Flow_Writeoffs_Select_Column || (Metal_Flow_Writeoffs_Select_Column = {}));
/** update columns of table "metal_flow.writeoffs" */
export var Metal_Flow_Writeoffs_Update_Column;
(function (Metal_Flow_Writeoffs_Update_Column) {
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["Date"] = "date";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["Id"] = "id";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["MaterialId"] = "material_id";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["Qty"] = "qty";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["Reason"] = "reason";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["Type"] = "type";
    /** column name */
    Metal_Flow_Writeoffs_Update_Column["TypeData"] = "type_data";
})(Metal_Flow_Writeoffs_Update_Column || (Metal_Flow_Writeoffs_Update_Column = {}));
/** column ordering options */
export var Order_By;
(function (Order_By) {
    /** in ascending order, nulls last */
    Order_By["Asc"] = "asc";
    /** in ascending order, nulls first */
    Order_By["AscNullsFirst"] = "asc_nulls_first";
    /** in ascending order, nulls last */
    Order_By["AscNullsLast"] = "asc_nulls_last";
    /** in descending order, nulls first */
    Order_By["Desc"] = "desc";
    /** in descending order, nulls first */
    Order_By["DescNullsFirst"] = "desc_nulls_first";
    /** in descending order, nulls last */
    Order_By["DescNullsLast"] = "desc_nulls_last";
})(Order_By || (Order_By = {}));
/** unique or primary key constraints on table "orders.attachments" */
export var Orders_Attachments_Constraint;
(function (Orders_Attachments_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Attachments_Constraint["DocsIdKey"] = "Docs_ID_key";
    /** unique or primary key constraint on columns "key" */
    Orders_Attachments_Constraint["DocsKeyKey"] = "Docs_Key_key";
    /** unique or primary key constraint on columns "id" */
    Orders_Attachments_Constraint["DocsPkey"] = "Docs_pkey";
})(Orders_Attachments_Constraint || (Orders_Attachments_Constraint = {}));
/** select columns of table "orders.attachments" */
export var Orders_Attachments_Select_Column;
(function (Orders_Attachments_Select_Column) {
    /** column name */
    Orders_Attachments_Select_Column["Filename"] = "filename";
    /** column name */
    Orders_Attachments_Select_Column["Id"] = "id";
    /** column name */
    Orders_Attachments_Select_Column["Key"] = "key";
    /** column name */
    Orders_Attachments_Select_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Attachments_Select_Column["Size"] = "size";
    /** column name */
    Orders_Attachments_Select_Column["UploadedAt"] = "uploaded_at";
})(Orders_Attachments_Select_Column || (Orders_Attachments_Select_Column = {}));
/** update columns of table "orders.attachments" */
export var Orders_Attachments_Update_Column;
(function (Orders_Attachments_Update_Column) {
    /** column name */
    Orders_Attachments_Update_Column["Filename"] = "filename";
    /** column name */
    Orders_Attachments_Update_Column["Id"] = "id";
    /** column name */
    Orders_Attachments_Update_Column["Key"] = "key";
    /** column name */
    Orders_Attachments_Update_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Attachments_Update_Column["Size"] = "size";
    /** column name */
    Orders_Attachments_Update_Column["UploadedAt"] = "uploaded_at";
})(Orders_Attachments_Update_Column || (Orders_Attachments_Update_Column = {}));
/** unique or primary key constraints on table "orders.comments" */
export var Orders_Comments_Constraint;
(function (Orders_Comments_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Comments_Constraint["CommentsPkey"] = "Comments_pkey";
})(Orders_Comments_Constraint || (Orders_Comments_Constraint = {}));
/** select columns of table "orders.comments" */
export var Orders_Comments_Select_Column;
(function (Orders_Comments_Select_Column) {
    /** column name */
    Orders_Comments_Select_Column["CreatedAt"] = "created_at";
    /** column name */
    Orders_Comments_Select_Column["Id"] = "id";
    /** column name */
    Orders_Comments_Select_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Comments_Select_Column["Text"] = "text";
    /** column name */
    Orders_Comments_Select_Column["UserId"] = "user_id";
})(Orders_Comments_Select_Column || (Orders_Comments_Select_Column = {}));
/** update columns of table "orders.comments" */
export var Orders_Comments_Update_Column;
(function (Orders_Comments_Update_Column) {
    /** column name */
    Orders_Comments_Update_Column["CreatedAt"] = "created_at";
    /** column name */
    Orders_Comments_Update_Column["Id"] = "id";
    /** column name */
    Orders_Comments_Update_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Comments_Update_Column["Text"] = "text";
    /** column name */
    Orders_Comments_Update_Column["UserId"] = "user_id";
})(Orders_Comments_Update_Column || (Orders_Comments_Update_Column = {}));
/** unique or primary key constraints on table "orders.notifications" */
export var Orders_Notifications_Constraint;
(function (Orders_Notifications_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Notifications_Constraint["NotificationsPkey"] = "Notifications_pkey";
})(Orders_Notifications_Constraint || (Orders_Notifications_Constraint = {}));
/** select columns of table "orders.notifications" */
export var Orders_Notifications_Select_Column;
(function (Orders_Notifications_Select_Column) {
    /** column name */
    Orders_Notifications_Select_Column["CommentId"] = "comment_id";
    /** column name */
    Orders_Notifications_Select_Column["Id"] = "id";
    /** column name */
    Orders_Notifications_Select_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Notifications_Select_Column["Seen"] = "seen";
    /** column name */
    Orders_Notifications_Select_Column["UserId"] = "user_id";
})(Orders_Notifications_Select_Column || (Orders_Notifications_Select_Column = {}));
/** select "orders_notifications_aggregate_bool_exp_bool_and_arguments_columns" columns of table "orders.notifications" */
export var Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
(function (Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns) {
    /** column name */
    Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns["Seen"] = "seen";
})(Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns || (Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_And_Arguments_Columns = {}));
/** select "orders_notifications_aggregate_bool_exp_bool_or_arguments_columns" columns of table "orders.notifications" */
export var Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
(function (Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns) {
    /** column name */
    Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns["Seen"] = "seen";
})(Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns || (Orders_Notifications_Select_Column_Orders_Notifications_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns = {}));
/** update columns of table "orders.notifications" */
export var Orders_Notifications_Update_Column;
(function (Orders_Notifications_Update_Column) {
    /** column name */
    Orders_Notifications_Update_Column["CommentId"] = "comment_id";
    /** column name */
    Orders_Notifications_Update_Column["Id"] = "id";
    /** column name */
    Orders_Notifications_Update_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Notifications_Update_Column["Seen"] = "seen";
    /** column name */
    Orders_Notifications_Update_Column["UserId"] = "user_id";
})(Orders_Notifications_Update_Column || (Orders_Notifications_Update_Column = {}));
/** unique or primary key constraints on table "orders.order_attachments" */
export var Orders_Order_Attachments_Constraint;
(function (Orders_Order_Attachments_Constraint) {
    /** unique or primary key constraint on columns "attachment_id", "order_id" */
    Orders_Order_Attachments_Constraint["OrdersAttachmentsPkey"] = "orders_attachments_pkey";
})(Orders_Order_Attachments_Constraint || (Orders_Order_Attachments_Constraint = {}));
/** select columns of table "orders.order_attachments" */
export var Orders_Order_Attachments_Select_Column;
(function (Orders_Order_Attachments_Select_Column) {
    /** column name */
    Orders_Order_Attachments_Select_Column["AttachmentId"] = "attachment_id";
    /** column name */
    Orders_Order_Attachments_Select_Column["OrderId"] = "order_id";
})(Orders_Order_Attachments_Select_Column || (Orders_Order_Attachments_Select_Column = {}));
/** update columns of table "orders.order_attachments" */
export var Orders_Order_Attachments_Update_Column;
(function (Orders_Order_Attachments_Update_Column) {
    /** column name */
    Orders_Order_Attachments_Update_Column["AttachmentId"] = "attachment_id";
    /** column name */
    Orders_Order_Attachments_Update_Column["OrderId"] = "order_id";
})(Orders_Order_Attachments_Update_Column || (Orders_Order_Attachments_Update_Column = {}));
/** unique or primary key constraints on table "orders.order_items" */
export var Orders_Order_Items_Constraint;
(function (Orders_Order_Items_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Order_Items_Constraint["OrderItemsPkey"] = "OrderItems_pkey";
})(Orders_Order_Items_Constraint || (Orders_Order_Items_Constraint = {}));
/** select columns of table "orders.order_items" */
export var Orders_Order_Items_Select_Column;
(function (Orders_Order_Items_Select_Column) {
    /** column name */
    Orders_Order_Items_Select_Column["AssemblerName"] = "assembler_name";
    /** column name */
    Orders_Order_Items_Select_Column["Description"] = "description";
    /** column name */
    Orders_Order_Items_Select_Column["Id"] = "id";
    /** column name */
    Orders_Order_Items_Select_Column["Name"] = "name";
    /** column name */
    Orders_Order_Items_Select_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Order_Items_Select_Column["Quantity"] = "quantity";
})(Orders_Order_Items_Select_Column || (Orders_Order_Items_Select_Column = {}));
/** update columns of table "orders.order_items" */
export var Orders_Order_Items_Update_Column;
(function (Orders_Order_Items_Update_Column) {
    /** column name */
    Orders_Order_Items_Update_Column["AssemblerName"] = "assembler_name";
    /** column name */
    Orders_Order_Items_Update_Column["Description"] = "description";
    /** column name */
    Orders_Order_Items_Update_Column["Id"] = "id";
    /** column name */
    Orders_Order_Items_Update_Column["Name"] = "name";
    /** column name */
    Orders_Order_Items_Update_Column["OrderId"] = "order_id";
    /** column name */
    Orders_Order_Items_Update_Column["Quantity"] = "quantity";
})(Orders_Order_Items_Update_Column || (Orders_Order_Items_Update_Column = {}));
/** unique or primary key constraints on table "orders.order_payments" */
export var Orders_Order_Payments_Constraint;
(function (Orders_Order_Payments_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Order_Payments_Constraint["PaymentHistoryIdKey"] = "PaymentHistory_id_key";
    /** unique or primary key constraint on columns "id" */
    Orders_Order_Payments_Constraint["PaymentHistoryPkey"] = "PaymentHistory_pkey";
})(Orders_Order_Payments_Constraint || (Orders_Order_Payments_Constraint = {}));
/** select columns of table "orders.order_payments" */
export var Orders_Order_Payments_Select_Column;
(function (Orders_Order_Payments_Select_Column) {
    /** column name */
    Orders_Order_Payments_Select_Column["Amount"] = "amount";
    /** column name */
    Orders_Order_Payments_Select_Column["Date"] = "date";
    /** column name */
    Orders_Order_Payments_Select_Column["Id"] = "id";
    /** column name */
    Orders_Order_Payments_Select_Column["OrderId"] = "order_id";
})(Orders_Order_Payments_Select_Column || (Orders_Order_Payments_Select_Column = {}));
/** update columns of table "orders.order_payments" */
export var Orders_Order_Payments_Update_Column;
(function (Orders_Order_Payments_Update_Column) {
    /** column name */
    Orders_Order_Payments_Update_Column["Amount"] = "amount";
    /** column name */
    Orders_Order_Payments_Update_Column["Date"] = "date";
    /** column name */
    Orders_Order_Payments_Update_Column["Id"] = "id";
    /** column name */
    Orders_Order_Payments_Update_Column["OrderId"] = "order_id";
})(Orders_Order_Payments_Update_Column || (Orders_Order_Payments_Update_Column = {}));
/** unique or primary key constraints on table "orders.orders" */
export var Orders_Orders_Constraint;
(function (Orders_Orders_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Orders_Orders_Constraint["OrdersPkey"] = "Orders_pkey";
})(Orders_Orders_Constraint || (Orders_Orders_Constraint = {}));
/** select columns of table "orders.orders" */
export var Orders_Orders_Select_Column;
(function (Orders_Orders_Select_Column) {
    /** column name */
    Orders_Orders_Select_Column["AcceptanceDate"] = "acceptance_date";
    /** column name */
    Orders_Orders_Select_Column["ActualShippingDate"] = "actual_shipping_date";
    /** column name */
    Orders_Orders_Select_Column["AwaitingDispatch"] = "awaiting_dispatch";
    /** column name */
    Orders_Orders_Select_Column["City"] = "city";
    /** column name */
    Orders_Orders_Select_Column["Comment"] = "comment";
    /** column name */
    Orders_Orders_Select_Column["Contractor"] = "contractor";
    /** column name */
    Orders_Orders_Select_Column["CreatedAt"] = "created_at";
    /** column name */
    Orders_Orders_Select_Column["Id"] = "id";
    /** column name */
    Orders_Orders_Select_Column["InvoiceNumber"] = "invoice_number";
    /** column name */
    Orders_Orders_Select_Column["IsReclamation"] = "is_reclamation";
    /** column name */
    Orders_Orders_Select_Column["ManagerId"] = "manager_id";
    /** column name */
    Orders_Orders_Select_Column["NeedAttention"] = "need_attention";
    /** column name */
    Orders_Orders_Select_Column["OrderNumber"] = "order_number";
    /** column name */
    Orders_Orders_Select_Column["ShippingDate"] = "shipping_date";
    /** column name */
    Orders_Orders_Select_Column["Status"] = "status";
    /** column name */
    Orders_Orders_Select_Column["TotalAmount"] = "total_amount";
})(Orders_Orders_Select_Column || (Orders_Orders_Select_Column = {}));
/** select "orders_orders_aggregate_bool_exp_bool_and_arguments_columns" columns of table "orders.orders" */
export var Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
(function (Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns) {
    /** column name */
    Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns["AwaitingDispatch"] = "awaiting_dispatch";
    /** column name */
    Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns["IsReclamation"] = "is_reclamation";
})(Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns || (Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns = {}));
/** select "orders_orders_aggregate_bool_exp_bool_or_arguments_columns" columns of table "orders.orders" */
export var Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
(function (Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns) {
    /** column name */
    Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns["AwaitingDispatch"] = "awaiting_dispatch";
    /** column name */
    Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns["IsReclamation"] = "is_reclamation";
})(Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns || (Orders_Orders_Select_Column_Orders_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns = {}));
/** update columns of table "orders.orders" */
export var Orders_Orders_Update_Column;
(function (Orders_Orders_Update_Column) {
    /** column name */
    Orders_Orders_Update_Column["AcceptanceDate"] = "acceptance_date";
    /** column name */
    Orders_Orders_Update_Column["ActualShippingDate"] = "actual_shipping_date";
    /** column name */
    Orders_Orders_Update_Column["AwaitingDispatch"] = "awaiting_dispatch";
    /** column name */
    Orders_Orders_Update_Column["City"] = "city";
    /** column name */
    Orders_Orders_Update_Column["Comment"] = "comment";
    /** column name */
    Orders_Orders_Update_Column["Contractor"] = "contractor";
    /** column name */
    Orders_Orders_Update_Column["CreatedAt"] = "created_at";
    /** column name */
    Orders_Orders_Update_Column["Id"] = "id";
    /** column name */
    Orders_Orders_Update_Column["InvoiceNumber"] = "invoice_number";
    /** column name */
    Orders_Orders_Update_Column["IsReclamation"] = "is_reclamation";
    /** column name */
    Orders_Orders_Update_Column["ManagerId"] = "manager_id";
    /** column name */
    Orders_Orders_Update_Column["NeedAttention"] = "need_attention";
    /** column name */
    Orders_Orders_Update_Column["OrderNumber"] = "order_number";
    /** column name */
    Orders_Orders_Update_Column["ShippingDate"] = "shipping_date";
    /** column name */
    Orders_Orders_Update_Column["Status"] = "status";
    /** column name */
    Orders_Orders_Update_Column["TotalAmount"] = "total_amount";
})(Orders_Orders_Update_Column || (Orders_Orders_Update_Column = {}));
/** unique or primary key constraints on table "refresh_tokens" */
export var Refresh_Tokens_Constraint;
(function (Refresh_Tokens_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Refresh_Tokens_Constraint["TokrnsPkey"] = "Tokrns_pkey";
})(Refresh_Tokens_Constraint || (Refresh_Tokens_Constraint = {}));
/** select columns of table "refresh_tokens" */
export var Refresh_Tokens_Select_Column;
(function (Refresh_Tokens_Select_Column) {
    /** column name */
    Refresh_Tokens_Select_Column["Id"] = "id";
    /** column name */
    Refresh_Tokens_Select_Column["Token"] = "token";
    /** column name */
    Refresh_Tokens_Select_Column["UserId"] = "user_id";
})(Refresh_Tokens_Select_Column || (Refresh_Tokens_Select_Column = {}));
/** update columns of table "refresh_tokens" */
export var Refresh_Tokens_Update_Column;
(function (Refresh_Tokens_Update_Column) {
    /** column name */
    Refresh_Tokens_Update_Column["Id"] = "id";
    /** column name */
    Refresh_Tokens_Update_Column["Token"] = "token";
    /** column name */
    Refresh_Tokens_Update_Column["UserId"] = "user_id";
})(Refresh_Tokens_Update_Column || (Refresh_Tokens_Update_Column = {}));
/** unique or primary key constraints on table "users" */
export var Users_Constraint;
(function (Users_Constraint) {
    /** unique or primary key constraint on columns "id" */
    Users_Constraint["UsersPkey"] = "Users_pkey";
})(Users_Constraint || (Users_Constraint = {}));
/** select columns of table "users" */
export var Users_Select_Column;
(function (Users_Select_Column) {
    /** column name */
    Users_Select_Column["Email"] = "email";
    /** column name */
    Users_Select_Column["FirstName"] = "first_name";
    /** column name */
    Users_Select_Column["Id"] = "id";
    /** column name */
    Users_Select_Column["LastName"] = "last_name";
    /** column name */
    Users_Select_Column["Password"] = "password";
    /** column name */
    Users_Select_Column["Role"] = "role";
})(Users_Select_Column || (Users_Select_Column = {}));
/** update columns of table "users" */
export var Users_Update_Column;
(function (Users_Update_Column) {
    /** column name */
    Users_Update_Column["Email"] = "email";
    /** column name */
    Users_Update_Column["FirstName"] = "first_name";
    /** column name */
    Users_Update_Column["Id"] = "id";
    /** column name */
    Users_Update_Column["LastName"] = "last_name";
    /** column name */
    Users_Update_Column["Password"] = "password";
    /** column name */
    Users_Update_Column["Role"] = "role";
})(Users_Update_Column || (Users_Update_Column = {}));
export const InsertDocsArrayMutationDocument = gql `
  mutation InsertDocsArrayMutation($objects: [attachments_insert_input!]!) {
    insert_attachments(objects: $objects) {
      affected_rows
      returning {
        id
        key
        size
        uploaded_at
        filename
      }
    }
  }
`;
export const DeleteDocsMutationDocument = gql `
  mutation DeleteDocsMutation($key: String!) {
    delete_orders_attachments(where: { key: { _eq: $key } }) {
      affected_rows
      returning {
        id
        key
      }
    }
  }
`;
export const InsertOrderAttachemntsDocument = gql `
  mutation InsertOrderAttachemnts(
    $attachments: [orders_order_attachments_insert_input!]!
  ) {
    insert_orders_order_attachments(objects: $attachments) {
      affected_rows
    }
  }
`;
export const InsertDetailAttachemntsDocument = gql `
  mutation InsertDetailAttachemnts(
    $detailAttachments: [metal_flow_detail_attachments_insert_input!]!
  ) {
    insert_metal_flow_detail_attachments(objects: $detailAttachments) {
      affected_rows
    }
  }
`;
export const AllOrdersPaymentsDataQueryDocument = gql `
  query AllOrdersPaymentsDataQuery {
    orders_orders(where: { status: { _eq: 3 } }, order_by: { id: desc }) {
      id
      total_amount
    }
  }
`;
export const UnpaidOrdersQueryDocument = gql `
  query UnpaidOrdersQuery($unpaidIDs: [Int!], $OrderStatus: Int!) {
    orders_orders(
      where: { status: { _eq: $OrderStatus }, id: { _in: $unpaidIDs } }
    ) {
      id
      contractor
      invoice_number
      city
      status
      shipping_date
      total_amount
      awaiting_dispatch
      actual_shipping_date
      created_at
      manager_id
      order_items {
        id
        quantity
        name
      }
      user {
        first_name
        last_name
      }
    }
  }
`;
export const AllTokensQueryDocument = gql `
  query AllTokensQuery {
    refresh_tokens {
      id
      token
      user {
        id
        first_name
        last_name
        email
        role
      }
    }
  }
`;
export const InsertTokenMutationDocument = gql `
  mutation InsertTokenMutation($user_id: Int!, $token: String!) {
    insert_refresh_tokens(objects: { user_id: $user_id, token: $token }) {
      returning {
        id
      }
    }
  }
`;
export const DeleteTokenMutationDocument = gql `
  mutation DeleteTokenMutation($token: String!) {
    delete_refresh_tokens(where: { token: { _eq: $token } }) {
      returning {
        id
      }
    }
  }
`;
export const UpdateTokenMutationDocument = gql `
  mutation UpdateTokenMutation($token_id: Int!, $token: String!) {
    update_refresh_tokens_by_pk(
      pk_columns: { id: $token_id }
      _set: { token: $token }
    ) {
      id
      user_id
    }
  }
`;
export const AllUsersQueryDocument = gql `
  query AllUsersQuery {
    users {
      id
      first_name
      last_name
      email
      password
      role
    }
  }
`;
export function getSdk(requester) {
    return {
        InsertDocsArrayMutation(variables, options) {
            return requester(InsertDocsArrayMutationDocument, variables, options);
        },
        DeleteDocsMutation(variables, options) {
            return requester(DeleteDocsMutationDocument, variables, options);
        },
        InsertOrderAttachemnts(variables, options) {
            return requester(InsertOrderAttachemntsDocument, variables, options);
        },
        InsertDetailAttachemnts(variables, options) {
            return requester(InsertDetailAttachemntsDocument, variables, options);
        },
        AllOrdersPaymentsDataQuery(variables, options) {
            return requester(AllOrdersPaymentsDataQueryDocument, variables, options);
        },
        UnpaidOrdersQuery(variables, options) {
            return requester(UnpaidOrdersQueryDocument, variables, options);
        },
        AllTokensQuery(variables, options) {
            return requester(AllTokensQueryDocument, variables, options);
        },
        InsertTokenMutation(variables, options) {
            return requester(InsertTokenMutationDocument, variables, options);
        },
        DeleteTokenMutation(variables, options) {
            return requester(DeleteTokenMutationDocument, variables, options);
        },
        UpdateTokenMutation(variables, options) {
            return requester(UpdateTokenMutationDocument, variables, options);
        },
        AllUsersQuery(variables, options) {
            return requester(AllUsersQueryDocument, variables, options);
        }
    };
}
//# sourceMappingURL=schema-typedefs.js.map