import React, { useState } from 'react';
import { DeerRecord, TransferRecord, HouseInfo } from '../../types/deer';
import {
  Plus,
  Search,
  Filter,
  ArrowRightLeft,
  Check,
  FileSpreadsheet,
  Eye,
  Calendar,
  Building2,
  Users,
  Radio,
  Video,
  Thermometer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface BasicInfoManagerProps {
  subTab: 'entry' | 'transfer' | 'house';
  deers: DeerRecord[];
  houses: HouseInfo[];
  transfers: TransferRecord[];
  onAddDeer: (deer: Partial<DeerRecord>) => void;
  onBatchAddDeers: (count: number, breed: '梅花鹿' | '马鹿', houseId: string) => void;
  onAddTransfer: (transfer: Omit<TransferRecord, 'id'>) => void;
  onSelectDeer: (deer: DeerRecord) => void;
}

export const BasicInfoManager: React.FC<BasicInfoManagerProps> = ({
  subTab,
  deers,
  houses,
  transfers,
  onAddDeer,
  onBatchAddDeers,
  onAddTransfer,
  onSelectDeer,
}) => {
  // 单个录入弹窗状态
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // 搜索与过滤
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState('ALL');
  const [selectedBreedFilter, setSelectedBreedFilter] = useState('ALL');

  // 新增单个鹿只表单
  const [newDeerForm, setNewDeerForm] = useState({
    name: '梅花鹿-新入库-001',
    breed: '梅花鹿' as '梅花鹿' | '马鹿' | '白鹿',
    gender: '公' as '公' | '母',
    ageMonths: 18,
    weightKg: 95,
    houseId: 'H-01',
    earTagId: `E501-R1-${String(deers.length + 1).padStart(4, '0')}`,
    rfidUid: `RFID-900M-${(deers.length + 1).toString(16).toUpperCase().padStart(8, '0')}`,
    batchNo: 'B202609-NEW',
  });

  // 批量入库表单
  const [batchForm, setBatchForm] = useState({
    count: 10,
    breed: '梅花鹿' as '梅花鹿' | '马鹿',
    houseId: 'H-01',
  });

  // 转舍调群表单
  const [transferForm, setTransferForm] = useState({
    tagId: deers[0]?.earTagId || '',
    toHouse: 'H-04',
    transferType: '病患隔离' as TransferRecord['transferType'],
    operator: '李兽医 (驻场)',
    reason: '体温高于警戒线，安排特护隔离舍观察',
  });

  const filteredDeers = deers.filter((d) => {
    const matchSearch = d.name.includes(searchTerm) || d.earTagId.includes(searchTerm) || d.rfidUid.includes(searchTerm);
    const matchHouse = selectedHouseFilter === 'ALL' || d.houseId === selectedHouseFilter;
    const matchBreed = selectedBreedFilter === 'ALL' || d.breed === selectedBreedFilter;
    return matchSearch && matchHouse && matchBreed;
  });

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const house = houses.find((h) => h.id === newDeerForm.houseId);
    onAddDeer({
      ...newDeerForm,
      houseName: house ? house.name : '1号特级种公鹿舍',
      status: 'healthy',
      temperature: 38.6,
      dailySteps: 5400,
      activeHours: 8.2,
      batteryLevel: 100,
      signalDbm: -52,
      lastReportTime: '刚刚',
      posX: 25 + Math.random() * 20,
      posY: 25 + Math.random() * 20,
      inSafeZone: true,
      entryDate: new Date().toISOString().split('T')[0],
      estrusScore: 10,
    });
    setShowSingleModal(false);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBatchAddDeers(batchForm.count, batchForm.breed, batchForm.houseId);
    setShowBatchModal(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDeer = deers.find((d) => d.earTagId === transferForm.tagId);
    const targetHouse = houses.find((h) => h.id === transferForm.toHouse);

    onAddTransfer({
      tagId: transferForm.tagId,
      deerName: targetDeer ? targetDeer.name : '未知鹿只',
      fromHouse: targetDeer ? targetDeer.houseName : '原圈舍',
      toHouse: targetHouse ? targetHouse.name : '目标圈舍',
      transferTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      transferType: transferForm.transferType,
      operator: transferForm.operator,
      reason: transferForm.reason,
      status: '已生效',
    });
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. 鹿只入库管理 */}
      {subTab === 'entry' && (
        <div className="space-y-3.5">
          {/* ===================== 顶部搜索与多维筛选卡片 (生态畜牧养殖主题) ===================== */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d6e4db] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center">
              {/* 字段 1: 鹿只名称 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  鹿只名称
                </label>
                <input
                  type="text"
                  placeholder="搜索鹿只名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f6faf7] hover:bg-[#ebf3ee] focus:bg-white border border-[#d6e4db] text-xs text-slate-800 px-3 py-2 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                />
              </div>

              {/* 字段 2: 耳标编码 / 批次 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  耳标编码 / 批次代码
                </label>
                <input
                  type="text"
                  placeholder="如: E501 或 B2026"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f6faf7] hover:bg-[#ebf3ee] focus:bg-white border border-[#d6e4db] text-xs text-slate-800 px-3 py-2 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors font-mono"
                />
              </div>

              {/* 字段 3: 鹿只品种 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  品种类型
                </label>
                <select
                  value={selectedBreedFilter}
                  onChange={(e) => setSelectedBreedFilter(e.target.value)}
                  className="w-full bg-[#f6faf7] hover:bg-[#ebf3ee] focus:bg-white border border-[#d6e4db] text-xs text-slate-700 px-3 py-2 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ALL">全部品种类型</option>
                  <option value="梅花鹿">双阳梅花鹿 (吉林原种)</option>
                  <option value="马鹿">东北马鹿 (高产型)</option>
                  <option value="白鹿">特异白鹿 (珍稀品系)</option>
                </select>
              </div>

              {/* 字段 4: 圈舍区域 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  养殖圈舍区域
                </label>
                <select
                  value={selectedHouseFilter}
                  onChange={(e) => setSelectedHouseFilter(e.target.value)}
                  className="w-full bg-[#f6faf7] hover:bg-[#ebf3ee] focus:bg-white border border-[#d6e4db] text-xs text-slate-700 px-3 py-2 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ALL">全部圈舍区域</option>
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 按钮组: 查询与重置 */}
              <div className="flex items-end space-x-2 pt-4 sm:pt-0">
                <button
                  onClick={() => {}}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedHouseFilter('ALL');
                    setSelectedBreedFilter('ALL');
                  }}
                  className="px-3.5 py-2 border border-[#d6e4db] hover:bg-[#f2f7f4] text-slate-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===================== 主数据台账卡片 (生态畜牧风格) ===================== */}
          <div className="bg-white rounded-xl shadow-xs border border-[#d6e4db] overflow-hidden">
            {/* 卡片顶栏操作区 */}
            <div className="p-4 border-b border-[#e8f1eb] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900">鹿只个体档案台账</span>
                <span className="text-xs text-slate-500">
                  共查询到 <strong className="text-emerald-700 font-mono font-bold">{filteredDeers.length}</strong> / {deers.length} 头鹿只
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  id="batch-entry-btn"
                  onClick={() => setShowBatchModal(true)}
                  className="px-3.5 py-1.5 bg-[#f0f6f2] hover:bg-[#e2ede6] text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#d6e4db]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>批量快速入库</span>
                </button>

                <button
                  id="single-entry-btn"
                  onClick={() => setShowSingleModal(true)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>新建鹿只档案</span>
                </button>
              </div>
            </div>

            {/* 表格区 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-[#f6faf7] text-[11px] text-slate-500 font-semibold border-b border-[#e8f1eb]">
                  <tr>
                    <th className="px-4 py-3">耳标编码</th>
                    <th className="px-4 py-3">鹿只名称</th>
                    <th className="px-4 py-3">品种类型 & 批次代码</th>
                    <th className="px-4 py-3">养殖所在圈舍区域</th>
                    <th className="px-4 py-3">建档周期起止时间</th>
                    <th className="px-4 py-3">生理状态</th>
                    <th className="px-4 py-3">当前体征 / 阶</th>
                    <th className="px-4 py-3">责任兽医</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef4f0] font-sans">
                  {filteredDeers.map((deer, idx) => {
                    const isFever = deer.status === 'sick' || deer.temperature >= 39.8;
                    const isEstrus = deer.status === 'estrus' || deer.estrusScore > 80;

                    return (
                      <tr key={deer.id} className="hover:bg-[#f6faf7] transition-colors">
                        {/* 耳标编码 (生态翡翠绿框胶囊) */}
                        <td className="px-4 py-3.5">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50/90 border border-emerald-200/90 text-emerald-800 font-mono font-bold rounded-lg text-xs shadow-2xs">
                            {deer.earTagId}
                          </span>
                        </td>

                        {/* 鹿只名称 */}
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900 text-xs tracking-tight">
                            {deer.name}
                          </div>
                        </td>

                        {/* 品种与批次代码 */}
                        <td className="px-4 py-3.5">
                          <div>
                            <div className="text-slate-800 font-medium">{deer.breed} ({deer.gender})</div>
                            <span className="inline-block mt-0.5 text-[10px] font-mono px-1.5 py-0.2 bg-[#f0f6f2] text-slate-600 rounded">
                              {deer.batchNo || 'BATCH-2026-01'}
                            </span>
                          </div>
                        </td>

                        {/* 养殖所在圈舍区域 (暖草木微胶囊) */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50/80 text-amber-800 border border-amber-200/80">
                            <span>📍</span>
                            <span>{deer.houseName} ({deer.penNo})</span>
                          </span>
                        </td>

                        {/* 建档周期起止时间 */}
                        <td className="px-4 py-3.5 text-[11px] font-mono text-slate-500">
                          <div>{deer.entryDate || '2026-03-01'}</div>
                          <div className="text-slate-400">至 2028-02-15</div>
                        </td>

                        {/* 生理状态 (绿点胶囊 ● 健康在栏) */}
                        <td className="px-4 py-3.5">
                          {isFever ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                              <span>高热预警</span>
                            </span>
                          ) : isEstrus ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              <span>发情活跃</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span>健康在栏</span>
                            </span>
                          )}
                        </td>

                        {/* 当前体征 / 阶 */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded">
                              V{((idx % 4) + 1)}.0
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {deer.temperature}℃
                            </span>
                          </div>
                        </td>

                        {/* 责任兽医 */}
                        <td className="px-4 py-3.5 text-xs text-slate-700">
                          {idx % 2 === 0 ? '王建国' : '李海波'}
                        </td>

                        {/* 操作 */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1">
                            <button
                              onClick={() => onSelectDeer(deer)}
                              className="px-2 py-1 rounded-md text-[11px] text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors cursor-pointer"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => {
                                setTransferForm((prev) => ({ ...prev, tagId: deer.earTagId }));
                                setShowTransferModal(true);
                              }}
                              className="px-2 py-1 rounded-md text-[11px] text-amber-600 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                            >
                              调群
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. 转舍 / 调群管理 */}
      {subTab === 'transfer' && (
        <div className="space-y-3.5">
          <div className="bg-white p-4 rounded-xl border border-[#d6e4db] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">转舍调群记录与通道自动更新</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                配合 900张/秒通道识读器 (RFID-PASS-4CH)，鹿只过门自动更新位置信息并生成履历。
              </p>
            </div>
            <button
              id="new-transfer-btn"
              onClick={() => setShowTransferModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>登记调群 / 转舍</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#d6e4db] shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#e8f1eb] flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">鹿只流转履历台账 (共 {transfers.length} 条记录)</span>
              <span className="text-[11px] text-emerald-700 font-medium">所有转舍数据即时同步至云端与PDA终端</span>
            </div>

            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">流转单号</th>
                  <th className="px-4 py-2.5">耳标编号 (RFID)</th>
                  <th className="px-4 py-2.5">鹿只名称</th>
                  <th className="px-4 py-2.5">调出圈舍</th>
                  <th className="px-4 py-2.5">调入目标圈舍</th>
                  <th className="px-4 py-2.5">转群类型</th>
                  <th className="px-4 py-2.5">转舍原因</th>
                  <th className="px-4 py-2.5">经办人</th>
                  <th className="px-4 py-2.5">操作时间</th>
                  <th className="px-4 py-2.5">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2 text-emerald-700">{tr.id}</td>
                    <td className="px-4 py-2 font-bold text-slate-900">{tr.tagId}</td>
                    <td className="px-4 py-2 font-sans font-medium">{tr.deerName}</td>
                    <td className="px-4 py-2 font-sans text-slate-600">{tr.fromHouse}</td>
                    <td className="px-4 py-2 font-sans text-emerald-700 font-semibold">{tr.toHouse}</td>
                    <td className="px-4 py-2 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700">
                        {tr.transferType}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-sans text-slate-600">{tr.reason}</td>
                    <td className="px-4 py-2 font-sans text-slate-500">{tr.operator}</td>
                    <td className="px-4 py-2 text-slate-500">{tr.transferTime}</td>
                    <td className="px-4 py-2 font-sans">
                      <span className="text-emerald-700 flex items-center gap-1 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" /> {tr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. 圈舍栏位配置 */}
      {subTab === 'house' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {houses.map((house) => {
              const occupancy = Math.round((house.currentCount / house.capacity) * 100);
              return (
                <div
                  key={house.id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/90 shadow-sm p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        {house.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{house.name}</h4>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>在栏 / 容量:</span>
                      <strong className="font-mono text-slate-900">
                        {house.currentCount} / {house.capacity} 只 ({occupancy}%)
                      </strong>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-500 font-mono">
                    <div className="flex justify-between">
                      <span>测温主机:</span>
                      <span className="text-emerald-700 font-bold">{house.hostId} (在线)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI球机:</span>
                      <span className="text-slate-800">{house.cameraIds.length} 路 4MP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>舍温 / 湿度:</span>
                      <span className="text-slate-800">{house.temperature}℃ / {house.humidity}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 单个录入建档弹窗 */}
      {showSingleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-lg w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" /> 单个鹿只入库与耳标绑定
              </h3>
              <button onClick={() => setShowSingleModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">鹿只名称/编号</label>
                  <input
                    type="text"
                    required
                    value={newDeerForm.name}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">测温计步耳标ID (E501-R1)</label>
                  <input
                    type="text"
                    required
                    value={newDeerForm.earTagId}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, earTagId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-emerald-700 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">品种</label>
                  <select
                    value={newDeerForm.breed}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, breed: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  >
                    <option value="梅花鹿">双阳梅花鹿</option>
                    <option value="马鹿">东北马鹿</option>
                    <option value="白鹿">特异白鹿</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">性别</label>
                  <select
                    value={newDeerForm.gender}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  >
                    <option value="公">公 (雄性)</option>
                    <option value="母">母 (雌性)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">月龄</label>
                  <input
                    type="number"
                    value={newDeerForm.ageMonths}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, ageMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">分配初始圈舍</label>
                  <select
                    value={newDeerForm.houseId}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, houseId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">体重 (kg)</label>
                  <input
                    type="number"
                    value={newDeerForm.weightKg}
                    onChange={(e) => setNewDeerForm({ ...newDeerForm, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800">
                ✓ 自动生成RFID电子档案与唯一档案号，数据毫秒级同步至边缘测温主机与PDA终端。
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  确认录入建档
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 批量快速入库弹窗 */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-md w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> 批量快速入库生成
              </h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">批量入库数量 (只)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batchForm.count}
                  onChange={(e) => setBatchForm({ ...batchForm, count: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">品种</label>
                <select
                  value={batchForm.breed}
                  onChange={(e) => setBatchForm({ ...batchForm, breed: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                >
                  <option value="梅花鹿">双阳梅花鹿</option>
                  <option value="马鹿">东北马鹿</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">目标圈舍</label>
                <select
                  value={batchForm.houseId}
                  onChange={(e) => setBatchForm({ ...batchForm, houseId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                系统将自动顺序分配 E501-R1 耳标ID 与 RFID 900MHz 标签，快速建立档案。
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  立即批量入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 登记转舍调群弹窗 */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-lg w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> 登记鹿只调群 / 转舍
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">选择调出鹿只 (耳标号)</label>
                <select
                  value={transferForm.tagId}
                  onChange={(e) => setTransferForm({ ...transferForm, tagId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800 font-mono font-bold"
                >
                  {deers.map((d) => (
                    <option key={d.id} value={d.earTagId}>
                      {d.earTagId} - {d.name} ({d.houseName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">目标调入圈舍</label>
                  <select
                    value={transferForm.toHouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toHouse: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">转群类型</label>
                  <select
                    value={transferForm.transferType}
                    onChange={(e) => setTransferForm({ ...transferForm, transferType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                  >
                    <option value="发情配种">发情配种转舍</option>
                    <option value="病患隔离">病患隔离特护</option>
                    <option value="断奶分栏">育成断奶分栏</option>
                    <option value="常规调配">常规舍位调配</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">经办人</label>
                <input
                  type="text"
                  value={transferForm.operator}
                  onChange={(e) => setTransferForm({ ...transferForm, operator: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">转舍原因说明</label>
                <textarea
                  rows={2}
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  立即生效流转
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
