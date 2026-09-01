-- 002_create_cost_items.sql
-- 직접공사비 내역(견적서) 데이터 테이블. 암호화된 데이터(encrypted_data)를 저장합니다.

CREATE TABLE cost_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id TEXT NOT NULL UNIQUE,
  encrypted_data TEXT NOT NULL, -- 브라우저에서 AES로 암호화된 JSON 문자열 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
