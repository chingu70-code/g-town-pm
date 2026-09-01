-- 003_create_resources.sql
-- 투입 계획서 (인력/장비/자재 배열) 데이터 방. 암호화된 데이터(encrypted_data)를 저장합니다.

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT NOT NULL UNIQUE,
  encrypted_data TEXT NOT NULL, -- 브라우저에서 AES로 암호화된 JSON 문자열 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
