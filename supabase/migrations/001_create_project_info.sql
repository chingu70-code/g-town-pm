-- 001_create_project_info.sql
-- 현장명, 담당자 이름 등 기본 정보를 저장하는 테이블

CREATE TABLE project_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  site_name TEXT,
  manager_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
