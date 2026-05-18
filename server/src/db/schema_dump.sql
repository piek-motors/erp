--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: hr; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hr;


ALTER SCHEMA hr OWNER TO postgres;

--
-- Name: orders; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA orders;


ALTER SCHEMA orders OWNER TO postgres;

--
-- Name: pdo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pdo;


ALTER SCHEMA pdo OWNER TO postgres;

--
-- Name: unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.unit_enum AS ENUM (
    'кг',
    'мм',
    'см',
    'м',
    'м^2',
    'm^3',
    'грамм',
    'штуки',
    'литры'
);


ALTER TYPE public.unit_enum OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'order_manager',
    'bookkeeper',
    'metalflow_worker',
    'warehouse_bookkeeper'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: writeoff_reason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.writeoff_reason AS ENUM (
    'производство',
    'брак',
    'продажа',
    'прочее'
);


ALTER TYPE public.writeoff_reason OWNER TO postgres;

--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: employee_absences; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.employee_absences (
    user_id integer NOT NULL,
    date date NOT NULL,
    reason character varying(1)
);


ALTER TABLE hr.employee_absences OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.employees (
    id integer NOT NULL,
    firstname text,
    lastname text,
    card character varying,
    created_at timestamp without time zone,
    job_title text,
    access_card text
);


ALTER TABLE hr.employees OWNER TO postgres;

--
-- Name: attendance_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_events_id_seq OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.events (
    id integer DEFAULT nextval('public.attendance_events_id_seq'::regclass) NOT NULL,
    card text NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    origin smallint
);


ALTER TABLE hr.events OWNER TO postgres;

--
-- Name: intervals; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.intervals (
    ent timestamp without time zone,
    ext timestamp without time zone,
    card character varying NOT NULL,
    database character varying DEFAULT 'factory'::character varying,
    ent_event_id integer NOT NULL,
    ext_event_id integer,
    updated_manually boolean,
    employee_id smallint NOT NULL
);


ALTER TABLE hr.intervals OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: hr; Owner: postgres
--

CREATE SEQUENCE hr.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hr.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: hr; Owner: postgres
--

ALTER SEQUENCE hr.users_id_seq OWNED BY hr.employees.id;


--
-- Name: comments; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.comments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    text text NOT NULL
);


ALTER TABLE orders.comments OWNER TO postgres;

--
-- Name: Comments_CommentID_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."Comments_CommentID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."Comments_CommentID_seq" OWNER TO postgres;

--
-- Name: Comments_CommentID_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."Comments_CommentID_seq" OWNED BY orders.comments.id;


--
-- Name: attachments; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.attachments (
    order_id integer NOT NULL,
    key text NOT NULL,
    filename text,
    id integer NOT NULL,
    size integer,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE orders.attachments OWNER TO postgres;

--
-- Name: Docs_ID_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."Docs_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."Docs_ID_seq" OWNER TO postgres;

--
-- Name: Docs_ID_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."Docs_ID_seq" OWNED BY orders.attachments.id;


--
-- Name: notifications; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.notifications (
    id integer NOT NULL,
    order_id integer,
    comment_id integer NOT NULL,
    user_id integer,
    seen boolean DEFAULT false NOT NULL
);


ALTER TABLE orders.notifications OWNER TO postgres;

--
-- Name: Notifications_ID_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."Notifications_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."Notifications_ID_seq" OWNER TO postgres;

--
-- Name: Notifications_ID_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."Notifications_ID_seq" OWNED BY orders.notifications.id;


--
-- Name: order_items; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    assembler_name character varying(255),
    description text
);


ALTER TABLE orders.order_items OWNER TO postgres;

--
-- Name: OrderItems_OrderItemID_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."OrderItems_OrderItemID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."OrderItems_OrderItemID_seq" OWNER TO postgres;

--
-- Name: OrderItems_OrderItemID_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."OrderItems_OrderItemID_seq" OWNED BY orders.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders (
    id integer NOT NULL,
    status integer NOT NULL,
    manager_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    contractor character varying(255),
    city character varying(255),
    total_amount numeric,
    comment text,
    invoice_number character varying,
    shipping_date date,
    awaiting_dispatch boolean DEFAULT false NOT NULL,
    acceptance_date timestamp without time zone,
    actual_shipping_date timestamp without time zone,
    order_number character varying,
    is_reclamation boolean DEFAULT false,
    need_attention text
);


ALTER TABLE orders.orders OWNER TO postgres;

--
-- Name: Orders_OrderID_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."Orders_OrderID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."Orders_OrderID_seq" OWNER TO postgres;

--
-- Name: Orders_OrderID_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."Orders_OrderID_seq" OWNED BY orders.orders.id;


--
-- Name: order_payments; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_payments (
    order_id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    amount numeric NOT NULL,
    id integer NOT NULL
);


ALTER TABLE orders.order_payments OWNER TO postgres;

--
-- Name: PaymentHistory_id_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders."PaymentHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders."PaymentHistory_id_seq" OWNER TO postgres;

--
-- Name: PaymentHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders."PaymentHistory_id_seq" OWNED BY orders.order_payments.id;


--
-- Name: order_attachments; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_attachments (
    order_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE orders.order_attachments OWNER TO postgres;

--
-- Name: detail_attachments; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.detail_attachments (
    detail_id integer NOT NULL,
    attachment_id integer NOT NULL
);


ALTER TABLE pdo.detail_attachments OWNER TO postgres;

--
-- Name: detail_group; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.detail_group (
    id integer NOT NULL,
    name text NOT NULL,
    parent_id integer
);


ALTER TABLE pdo.detail_group OWNER TO postgres;

--
-- Name: detail_group_details; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.detail_group_details (
    group_id integer NOT NULL,
    detail_id integer NOT NULL
);


ALTER TABLE pdo.detail_group_details OWNER TO postgres;

--
-- Name: detail_group_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.detail_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.detail_group_id_seq OWNER TO postgres;

--
-- Name: detail_group_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.detail_group_id_seq OWNED BY pdo.detail_group.id;


--
-- Name: details; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.details (
    id integer NOT NULL,
    name text NOT NULL,
    drawing_number text,
    on_hand_balance real DEFAULT 0,
    description text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    drawing_name text,
    workflow jsonb,
    blank jsonb,
    unit integer DEFAULT 4 NOT NULL,
    recommended_batch_size integer,
    stock_location text
);


ALTER TABLE pdo.details OWNER TO postgres;

--
-- Name: details_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.details_id_seq OWNER TO postgres;

--
-- Name: details_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.details_id_seq OWNED BY pdo.details.id;


--
-- Name: dict_operation_kinds; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.dict_operation_kinds (
    id integer NOT NULL,
    v text NOT NULL
);


ALTER TABLE pdo.dict_operation_kinds OWNER TO postgres;

--
-- Name: dict_operation_kinds_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.dict_operation_kinds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.dict_operation_kinds_id_seq OWNER TO postgres;

--
-- Name: dict_operation_kinds_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.dict_operation_kinds_id_seq OWNED BY pdo.dict_operation_kinds.id;


--
-- Name: inventory_log; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.inventory_log (
    id integer NOT NULL,
    operation_type smallint NOT NULL,
    material_id integer,
    detail_id integer,
    qty numeric NOT NULL,
    data jsonb,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL,
    reason integer NOT NULL,
    manufacturing_order_id integer,
    material_unit smallint,
    subject smallint DEFAULT 0 NOT NULL
);


ALTER TABLE pdo.inventory_log OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.orders (
    id integer NOT NULL,
    detail_id integer NOT NULL,
    qty integer NOT NULL,
    finished_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    material_writeoffs jsonb,
    status integer DEFAULT 0 NOT NULL,
    started_at timestamp without time zone,
    current_operation smallint,
    current_operation_start_at bigint,
    output_qty integer,
    priority smallint DEFAULT 1
);


ALTER TABLE pdo.orders OWNER TO postgres;

--
-- Name: manufacturing_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.manufacturing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.manufacturing_id_seq OWNER TO postgres;

--
-- Name: manufacturing_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.manufacturing_id_seq OWNED BY pdo.orders.id;


--
-- Name: materials; Type: TABLE; Schema: pdo; Owner: postgres
--

CREATE TABLE pdo.materials (
    id integer NOT NULL,
    unit integer DEFAULT 0 NOT NULL,
    label text NOT NULL,
    on_hand_balance real DEFAULT 0,
    linear_mass real DEFAULT 0,
    alloy text,
    shortage_prediction_horizon_days smallint DEFAULT 60 NOT NULL
);


ALTER TABLE pdo.materials OWNER TO postgres;

--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.materials_id_seq OWNER TO postgres;

--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.materials_id_seq OWNED BY pdo.materials.id;


--
-- Name: operations_id_seq; Type: SEQUENCE; Schema: pdo; Owner: postgres
--

CREATE SEQUENCE pdo.operations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pdo.operations_id_seq OWNER TO postgres;

--
-- Name: operations_id_seq; Type: SEQUENCE OWNED BY; Schema: pdo; Owner: postgres
--

ALTER SEQUENCE pdo.operations_id_seq OWNED BY pdo.inventory_log.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: Tokrns_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tokrns_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tokrns_ID_seq" OWNER TO postgres;

--
-- Name: Tokrns_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tokrns_ID_seq" OWNED BY public.refresh_tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    password character varying(100),
    email character varying(100),
    is_deleted boolean DEFAULT false NOT NULL,
    roles text[] DEFAULT ARRAY[]::text[] NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: Users_UserID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_UserID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_UserID_seq" OWNER TO postgres;

--
-- Name: Users_UserID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_UserID_seq" OWNED BY public.users.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    key text NOT NULL,
    filename text NOT NULL,
    size integer NOT NULL,
    uploaded_at timestamp without time zone NOT NULL
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_id_seq OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: kysely_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration (
    name character varying(255) NOT NULL,
    "timestamp" character varying(255) NOT NULL
);


ALTER TABLE public.kysely_migration OWNER TO postgres;

--
-- Name: kysely_migration_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration_lock (
    id character varying(255) NOT NULL,
    is_locked integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.kysely_migration_lock OWNER TO postgres;

--
-- Name: employees id; Type: DEFAULT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.employees ALTER COLUMN id SET DEFAULT nextval('hr.users_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.attachments ALTER COLUMN id SET DEFAULT nextval('orders."Docs_ID_seq"'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.comments ALTER COLUMN id SET DEFAULT nextval('orders."Comments_CommentID_seq"'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.notifications ALTER COLUMN id SET DEFAULT nextval('orders."Notifications_ID_seq"'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_items ALTER COLUMN id SET DEFAULT nextval('orders."OrderItems_OrderItemID_seq"'::regclass);


--
-- Name: order_payments id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_payments ALTER COLUMN id SET DEFAULT nextval('orders."PaymentHistory_id_seq"'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders ALTER COLUMN id SET DEFAULT nextval('orders."Orders_OrderID_seq"'::regclass);


--
-- Name: detail_group id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group ALTER COLUMN id SET DEFAULT nextval('pdo.detail_group_id_seq'::regclass);


--
-- Name: details id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.details ALTER COLUMN id SET DEFAULT nextval('pdo.details_id_seq'::regclass);


--
-- Name: dict_operation_kinds id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.dict_operation_kinds ALTER COLUMN id SET DEFAULT nextval('pdo.dict_operation_kinds_id_seq'::regclass);


--
-- Name: inventory_log id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.inventory_log ALTER COLUMN id SET DEFAULT nextval('pdo.operations_id_seq'::regclass);


--
-- Name: materials id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.materials ALTER COLUMN id SET DEFAULT nextval('pdo.materials_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.orders ALTER COLUMN id SET DEFAULT nextval('pdo.manufacturing_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public."Tokrns_ID_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public."Users_UserID_seq"'::regclass);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: employee_absences employee_absences_pk; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.employee_absences
    ADD CONSTRAINT employee_absences_pk PRIMARY KEY (user_id, date);


--
-- Name: intervals ent_event_id; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.intervals
    ADD CONSTRAINT ent_event_id UNIQUE (ent_event_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: intervals intervals_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.intervals
    ADD CONSTRAINT intervals_pkey PRIMARY KEY (card, ent_event_id);


--
-- Name: employees unique_card; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.employees
    ADD CONSTRAINT unique_card UNIQUE (card);


--
-- Name: employees users_card_key; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.employees
    ADD CONSTRAINT users_card_key UNIQUE (card);


--
-- Name: employees users_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.employees
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments Comments_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.comments
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: attachments Docs_ID_key; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.attachments
    ADD CONSTRAINT "Docs_ID_key" UNIQUE (id);


--
-- Name: attachments Docs_Key_key; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.attachments
    ADD CONSTRAINT "Docs_Key_key" UNIQUE (key);


--
-- Name: attachments Docs_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.attachments
    ADD CONSTRAINT "Docs_pkey" PRIMARY KEY (id);


--
-- Name: notifications Notifications_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.notifications
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: order_items OrderItems_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_items
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (id);


--
-- Name: orders Orders_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: order_payments PaymentHistory_id_key; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_payments
    ADD CONSTRAINT "PaymentHistory_id_key" UNIQUE (id);


--
-- Name: order_payments PaymentHistory_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_payments
    ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);


--
-- Name: order_attachments orders_attachments_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_attachments
    ADD CONSTRAINT orders_attachments_pkey PRIMARY KEY (order_id, attachment_id);


--
-- Name: detail_attachments detail_attachments_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_attachments
    ADD CONSTRAINT detail_attachments_pkey PRIMARY KEY (detail_id, attachment_id);


--
-- Name: detail_group detail_group_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group
    ADD CONSTRAINT detail_group_pkey PRIMARY KEY (id);


--
-- Name: detail_group_details detail_logical_group_details_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group_details
    ADD CONSTRAINT detail_logical_group_details_pkey PRIMARY KEY (detail_id, group_id);


--
-- Name: details details_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.details
    ADD CONSTRAINT details_pkey PRIMARY KEY (id);


--
-- Name: dict_operation_kinds dict_operation_kinds_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.dict_operation_kinds
    ADD CONSTRAINT dict_operation_kinds_pkey PRIMARY KEY (id);


--
-- Name: dict_operation_kinds dict_operation_kinds_v_key; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.dict_operation_kinds
    ADD CONSTRAINT dict_operation_kinds_v_key UNIQUE (v);


--
-- Name: orders manufacturing_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.orders
    ADD CONSTRAINT manufacturing_pkey PRIMARY KEY (id);


--
-- Name: materials materials_label_key; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.materials
    ADD CONSTRAINT materials_label_key UNIQUE (label);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: inventory_log operations_pkey; Type: CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.inventory_log
    ADD CONSTRAINT operations_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens Tokrns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "Tokrns_pkey" PRIMARY KEY (id);


--
-- Name: users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration_lock kysely_migration_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration_lock
    ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration kysely_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration
    ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: attendance_events_card_ts_idx; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE UNIQUE INDEX attendance_events_card_ts_idx ON hr.events USING btree (card, "timestamp");


--
-- Name: attendance_events_timestamp_idx; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX attendance_events_timestamp_idx ON hr.events USING btree ("timestamp");


--
-- Name: attendance_intervals_unique_card_ent_ext; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE UNIQUE INDEX attendance_intervals_unique_card_ent_ext ON hr.intervals USING btree (card, ent, ext);


--
-- Name: employee_absences_date_idx; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX employee_absences_date_idx ON hr.employee_absences USING btree (date);


--
-- Name: idx_orders_contractor; Type: INDEX; Schema: orders; Owner: postgres
--

CREATE INDEX idx_orders_contractor ON orders.orders USING hash (contractor);


--
-- Name: idx_orders_invoice_number; Type: INDEX; Schema: orders; Owner: postgres
--

CREATE INDEX idx_orders_invoice_number ON orders.orders USING btree (invoice_number);


--
-- Name: idx_orders_status; Type: INDEX; Schema: orders; Owner: postgres
--

CREATE INDEX idx_orders_status ON orders.orders USING hash (status);


--
-- Name: idx_detail_group_parent_id; Type: INDEX; Schema: pdo; Owner: postgres
--

CREATE INDEX idx_detail_group_parent_id ON pdo.detail_group USING btree (parent_id);


--
-- Name: idx_details_automatic_writeoff_material_id; Type: INDEX; Schema: pdo; Owner: postgres
--

CREATE INDEX idx_details_automatic_writeoff_material_id ON pdo.details USING btree (((((blank -> 'material'::text) ->> 'material_id'::text))::integer)) WHERE ((blank -> 'material'::text) IS NOT NULL);


--
-- Name: refresh_tokens_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_token_hash ON public.refresh_tokens USING hash (token);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervals Intervals_Card_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.intervals
    ADD CONSTRAINT "Intervals_Card_fkey" FOREIGN KEY (card) REFERENCES hr.employees(card) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervals intervals_employee_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.intervals
    ADD CONSTRAINT intervals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES hr.employees(id) ON DELETE CASCADE;


--
-- Name: comments Comments_OrderID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.comments
    ADD CONSTRAINT "Comments_OrderID_fkey" FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments Comments_UserID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.comments
    ADD CONSTRAINT "Comments_UserID_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: attachments Docs_OrderID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.attachments
    ADD CONSTRAINT "Docs_OrderID_fkey" FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications Notifications_CommentID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.notifications
    ADD CONSTRAINT "Notifications_CommentID_fkey" FOREIGN KEY (comment_id) REFERENCES orders.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications Notifications_MentionedUser_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.notifications
    ADD CONSTRAINT "Notifications_MentionedUser_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications Notifications_OrderID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.notifications
    ADD CONSTRAINT "Notifications_OrderID_fkey" FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items OrderItems_OrderID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_items
    ADD CONSTRAINT "OrderItems_OrderID_fkey" FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders Orders_ManagerID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT "Orders_ManagerID_fkey" FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: order_payments PaymentHistory_OrderID_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_payments
    ADD CONSTRAINT "PaymentHistory_OrderID_fkey" FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_attachments order_attachments_attachment_id_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_attachments
    ADD CONSTRAINT order_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachments(id) ON DELETE CASCADE;


--
-- Name: order_attachments order_attachments_order_id_fkey; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_attachments
    ADD CONSTRAINT order_attachments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON DELETE CASCADE;


--
-- Name: detail_attachments detail_attachments_attachment_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_attachments
    ADD CONSTRAINT detail_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachments(id) ON DELETE CASCADE;


--
-- Name: detail_attachments detail_attachments_detail_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_attachments
    ADD CONSTRAINT detail_attachments_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES pdo.details(id) ON DELETE CASCADE;


--
-- Name: detail_group_details detail_group_details_detail_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group_details
    ADD CONSTRAINT detail_group_details_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES pdo.details(id) ON DELETE CASCADE;


--
-- Name: detail_group_details detail_group_details_group_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group_details
    ADD CONSTRAINT detail_group_details_group_id_fkey FOREIGN KEY (group_id) REFERENCES pdo.detail_group(id);


--
-- Name: detail_group detail_group_parent_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.detail_group
    ADD CONSTRAINT detail_group_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES pdo.detail_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders manufacturing_detail_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.orders
    ADD CONSTRAINT manufacturing_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES pdo.details(id) ON DELETE CASCADE;


--
-- Name: inventory_log operations_detail_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.inventory_log
    ADD CONSTRAINT operations_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES pdo.details(id) ON DELETE SET NULL;


--
-- Name: inventory_log operations_manufacturing_order_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.inventory_log
    ADD CONSTRAINT operations_manufacturing_order_id_fkey FOREIGN KEY (manufacturing_order_id) REFERENCES pdo.orders(id) ON DELETE SET NULL;


--
-- Name: inventory_log operations_material_id_fkey; Type: FK CONSTRAINT; Schema: pdo; Owner: postgres
--

ALTER TABLE ONLY pdo.inventory_log
    ADD CONSTRAINT operations_material_id_fkey FOREIGN KEY (material_id) REFERENCES pdo.materials(id);


--
-- Name: refresh_tokens Tokrns_UserID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "Tokrns_UserID_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: SCHEMA hr; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA hr TO timeformer;


--
-- Name: TABLE employee_absences; Type: ACL; Schema: hr; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE hr.employee_absences TO timeformer;


--
-- Name: TABLE employees; Type: ACL; Schema: hr; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE hr.employees TO timeformer;


--
-- Name: TABLE events; Type: ACL; Schema: hr; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE hr.events TO timeformer;


--
-- Name: TABLE intervals; Type: ACL; Schema: hr; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE hr.intervals TO timeformer;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: hr; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE hr.users_id_seq TO timeformer;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: hr; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA hr GRANT SELECT,USAGE ON SEQUENCES TO timeformer;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: hr; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA hr GRANT SELECT,INSERT,UPDATE ON TABLES TO timeformer;


--
-- PostgreSQL database dump complete
--

