import { supabase } from './supabaseClient';
import { encryptData, decryptData } from './encryption';

export const saveToCloud = async (tableName: string, dataId: string, rawData: any) => {
  const jsonString = JSON.stringify(rawData);
  const encrypted = encryptData(jsonString);
  const idColumn = tableName.endsWith('s') ? tableName.slice(0, -1) + '_id' : 'id';
  
  try {
    const { error } = await supabase
      .from(tableName)
      .upsert({ 
        [idColumn]: dataId,
        encrypted_data: encrypted,
        updated_at: new Date().toISOString()
      }, { onConflict: idColumn });

    if (error) console.warn("[Cloud Sync] " + tableName + " 실패:", error.message);
  } catch (err) {}
};

export const syncAllFromCloud = async () => {
  console.log('[Cloud Sync] 서버에서 최신 데이터 가져오는 중...');
  try {
    // 1. 프로젝트 정보 가져오기
    const { data: pData } = await supabase.from('project_info').select('encrypted_data').eq('id', 'gtown_main').single();
    if (pData?.encrypted_data) {
      const pParsed = JSON.parse(decryptData(pData.encrypted_data) || '{}');
      if (pParsed.projectName) localStorage.setItem('pm_projectName', pParsed.projectName);
      if (pParsed.managerName) localStorage.setItem('pm_managerName', pParsed.managerName);
      if (pParsed.siteName) localStorage.setItem('pm_siteName', pParsed.siteName);
    }

    // 2. 비용 데이터 가져오기
    const { data: cData } = await supabase.from('cost_items').select('encrypted_data').eq('cost_item_id', 'gtown_main').single();
    if (cData?.encrypted_data) {
      const dec = decryptData(cData.encrypted_data);
      if (dec) localStorage.setItem('gTownCostItems', dec);
    }

    // 3. 자원 데이터 가져오기
    const { data: rData } = await supabase.from('resources').select('encrypted_data').eq('resource_id', 'gtown_main').single();
    if (rData?.encrypted_data) {
      const dec = decryptData(rData.encrypted_data);
      if (dec) localStorage.setItem('gTownResources', dec);
    }
    
    // 4. 간접비 오버라이드 데이터 가져오기
    const { data: iData } = await supabase.from('project_info').select('encrypted_data').eq('id', 'gtown_indirects').single();
    if (iData?.encrypted_data) {
      const dec = decryptData(iData.encrypted_data);
      if (dec) localStorage.setItem('gTownIndirectOverrides', dec);
    }
    
    // 5. 메모장 데이터 가져오기
    const { data: mData } = await supabase.from('project_info').select('encrypted_data').eq('id', 'gtown_memo').single();
    if (mData?.encrypted_data) {
      const dec = decryptData(mData.encrypted_data);
      if (dec) localStorage.setItem('gTownMemo', dec);
    }
    
    // 6. 마스터 스케줄 데이터 가져오기
    const { data: sData } = await supabase.from('project_info').select('encrypted_data').eq('id', 'gtown_schedule').single();
    if (sData?.encrypted_data) {
      const dec = decryptData(sData.encrypted_data);
      if (dec) localStorage.setItem('gTownSchedule', dec);
    }
    
    return true;
  } catch (err) {
    console.warn('[Cloud Sync] 네트워크 오류 또는 초기화 전입니다. 로컬 데이터를 유지합니다.');
    return false;
  }
};
