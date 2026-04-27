--
-- PostgreSQL database dump
--

\restrict DXC7mCzebLci26eu29bZ2b4msonZ8ylfxZsjD4yTNjQ4daNmdHNOS28EkKy4vBr

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

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

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_user_name_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_user_id_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_id character varying(30) NOT NULL,
    user_name character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, user_id, user_name, password_hash, created_at) FROM stdin;
13	a	a	$argon2id$v=19$m=65536,t=3,p=4$6rliSVN8DSgz1OQ6JUXFTw$d7Ie1U8pck11kl1PCkdtsnafa/mt5hCz6aRiwtIx/II	2026-04-17 15:34:01.108747+09
14	TestUser001	harunarimotoki	$argon2id$v=19$m=65536,t=3,p=4$+2UGrx5eu4/lWClHip3pPA$6HSfbcLqEvzkG8F2OUb55MuwwemxL8l8Ui+mQgKtnlA	2026-04-17 16:59:18.908661+09
15	Testuser001	Testuser001	$argon2id$v=19$m=65536,t=3,p=4$PvLoVYINSLtvXYwXtJEfjA$5H3X9vG0RpQ46G7JZw0djAjjCwWQeKAvrCNpk8wQ74g	2026-04-19 13:26:12.184168+09
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- Name: users users_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_name_key UNIQUE (user_name);


--
-- PostgreSQL database dump complete
--

\unrestrict DXC7mCzebLci26eu29bZ2b4msonZ8ylfxZsjD4yTNjQ4daNmdHNOS28EkKy4vBr

