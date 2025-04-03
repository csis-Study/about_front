import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, theme, Tag, Table, Row, Col, Select, Modal, Input, Button, Space, message, Card, Tabs, Typography, Descriptions, Divider, Badge, Statistic, Timeline, Empty, Tooltip } from 'antd';
import { AuditOutlined, UserSwitchOutlined, ReloadOutlined, FileSearchOutlined, EyeOutlined } from "@ant-design/icons";
import Logout from '../../components/Logout';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// 定义审批等级顺序
const APPROVAL_LEVELS = ['客户经理', '风控人员', '合规人员'];

// 模拟产品类型
const PRODUCT_TYPES = ['基金', '股票', '理财产品'];

// 模拟基金列表
const FUNDS = [
    { id: 'GF00721', name: '广发沪深300指数增强A', risk: '中风险', manager: '刘志军', yield: '6.89%', period: '无固定期限', description: '该基金采用指数增强投资策略，以沪深300指数为基准，结合量化模型筛选股票，力求超额收益' },
    { id: 'HX03582', name: '华夏创新前沿混合A', risk: '高风险', manager: '王浩然', yield: '12.37%', period: '无固定期限', description: '重点投资于科技创新领域的优质企业，聚焦人工智能、云计算、生物医药等前沿领域' },
    { id: 'ZS05182', name: '中欧稳健债券型A', risk: '低风险', manager: '刘婉秋', yield: '3.92%', period: '无固定期限', description: '主要投资于信用评级较高的固定收益类资产，在控制风险的基础上追求稳健回报' },
    { id: 'YF09127', name: '易方达医疗健康行业混合', risk: '中高风险', manager: '张晓东', yield: '9.65%', period: '无固定期限', description: '专注医疗健康产业链投资，把握人口老龄化及医疗健康消费升级带来的投资机会' },
    { id: 'HG01268', name: '华泰柏瑞消费成长混合A', risk: '中高风险', manager: '李晓明', yield: '8.74%', period: '无固定期限', description: '投资消费升级领域，关注新消费模式、品牌消费和高端消费品等投资机会' },
    { id: 'JX05291', name: '嘉实金融精选A', risk: '中风险', manager: '陈志民', yield: '7.31%', period: '无固定期限', description: '重点投资于银行、保险、证券等金融行业优质企业，精选具有估值优势和成长性的金融股' },
];

// 模拟股票列表
const STOCKS = [
    { id: 'SH601398', name: '工商银行', code: '601398', price: '4.52', market: '上海', industry: '银行', pe: '5.32', description: '中国最大的商业银行之一，资产规模领先，拥有广泛的客户基础和分支网络' },
    { id: 'SZ000858', name: '五粮液', code: '000858', price: '169.35', market: '深圳', industry: '白酒', pe: '28.64', description: '中国著名白酒生产企业，以酿造浓香型高档白酒著称，品牌价值和市场份额位居行业前列' },
    { id: 'SH600036', name: '招商银行', code: '600036', price: '37.82', market: '上海', industry: '银行', pe: '7.45', description: '中国领先的零售银行，在财富管理和信用卡业务方面具有显著优势' },
    { id: 'SH600276', name: '恒瑞医药', code: '600276', price: '32.94', market: '上海', industry: '医药', pe: '46.37', description: '国内领先的创新型制药企业，专注于抗肿瘤药、手术用药等领域的研发和生产' },
    { id: 'SZ300750', name: '宁德时代', code: '300750', price: '216.73', market: '深圳', industry: '新能源', pe: '52.86', description: '全球领先的动力电池系统和储能系统提供商，在电动汽车电池领域市场份额领先' },
    { id: 'SH603288', name: '海天味业', code: '603288', price: '65.38', market: '上海', industry: '食品饮料', pe: '36.29', description: '国内调味品行业龙头企业，产品包括酱油、蚝油、酱和醋等，品牌认可度高' },
    { id: 'SH600519', name: '贵州茅台', code: '600519', price: '1693.58', market: '上海', industry: '白酒', pe: '30.17', description: '中国最具价值的白酒品牌，酱香型白酒的代表，产品具有极高的品牌溢价和收藏价值' },
    { id: 'SZ002594', name: '比亚迪', code: '002594', price: '252.68', market: '深圳', industry: '汽车', pe: '58.42', description: '中国新能源汽车行业领军企业，在电动车和动力电池领域拥有全产业链布局' },
];

// 模拟理财产品
const FINANCIAL_PRODUCTS = [
    { id: 'CX2023428', name: '招银避险增利系列', risk: '低风险', yield: '3.65%', period: '364天', description: '本产品投资于货币市场工具和固定收益类资产，适合稳健型投资者作为现金管理工具' },
    { id: 'GS2023176', name: '工银"e灵通"', risk: '低风险', yield: '3.85%', period: '180天', description: '本产品为非保本浮动收益型，主要投资于货币市场和债券市场，流动性较好' },
    { id: 'ZX2023059', name: '中信睿远稳健增益', risk: '中风险', yield: '5.10%', period: '90天', description: '本产品主要投资于优质债券和部分低波动性权益类资产，追求稳健收益' },
    { id: 'PA2023102', name: '平安鑫利多金A款', risk: '中低风险', yield: '4.25%', period: '270天', description: '本结构性产品收益与沪深300指数挂钩，保证本金100%安全，同时提供限定的指数收益' },
    { id: 'JT2023254', name: '交银智能配置优选', risk: '中风险', yield: '4.95%', period: '120天', description: '本产品基于量化模型进行资产配置，同时运用大数据和AI技术进行风险管控' },
    { id: 'MS2023089', name: '民生鑫盈债券精选', risk: '中高风险', yield: '5.85%', period: '365天', description: '本产品主要投资于高评级企业债券组合，适合风险承受能力较强的投资者' },
    { id: 'PF2023321', name: '浦发银行黄金挂钩A系列', risk: '中风险', yield: '4.75%', period: '180天', description: '本产品收益率与国际黄金价格挂钩，为投资者提供分散投资和抗通胀保值功能' },
    { id: 'ZS2023165', name: '招商银行美元利率联动', risk: '中高风险', yield: '5.35%', period: '365天', description: '本产品收益与美元利率走势相关，适合看好美元利率上升的投资者' },
];

// 模拟客户信息
const CUSTOMERS = [
    { id: 'C1010083276', name: '张建国', age: 52, risk: '保守型', occupation: '国企高管', assets: '1200万元', contact: '13901086529', address: '北京市朝阳区建国路89号', vip: '钻石客户', history: '2012年开户' },
    { id: 'C1020067185', name: '李伟', age: 37, risk: '进取型', occupation: '互联网创业者', assets: '450万元', contact: '18618866372', address: '上海市浦东新区张杨路1500号', vip: '黄金客户', history: '2017年开户' },
    { id: 'C1035072594', name: '王思敏', age: 32, risk: '激进型', occupation: '金融分析师', assets: '280万元', contact: '13671589026', address: '广州市天河区珠江新城', vip: '白银客户', history: '2019年开户' },
    { id: 'C1042093861', name: '赵明', age: 58, risk: '稳健型', occupation: '退休教授', assets: '320万元', contact: '13882654109', address: '成都市锦江区东大街42号', vip: '白银客户', history: '2016年开户' },
    { id: 'C1057023698', name: '钱晓芳', age: 43, risk: '进取型', occupation: '医院主任', assets: '580万元', contact: '13987654321', address: '深圳市南山区科技园', vip: '黄金客户', history: '2015年开户' },
    { id: 'C1063045289', name: '孙勇', age: 48, risk: '稳健型', occupation: '事业单位负责人', assets: '350万元', contact: '13612378906', address: '杭州市西湖区教工路', vip: '白银客户', history: '2014年开户' },
    { id: 'C1072056743', name: '周涛', age: 41, risk: '保守型', occupation: '律师事务所合伙人', assets: '620万元', contact: '13896543210', address: '南京市鼓楼区中央路', vip: '黄金客户', history: '2013年开户' },
    { id: 'C1081034527', name: '吴强', age: 56, risk: '激进型', occupation: '民营企业董事长', assets: '2500万元', contact: '13709876543', address: '武汉市江汉区解放大道', vip: '钻石客户', history: '2011年开户' },
    { id: 'C1092087654', name: '郑小玲', age: 35, risk: '进取型', occupation: '广告公司创意总监', assets: '220万元', contact: '13612345678', address: '重庆市渝中区解放碑', vip: '普通客户', history: '2020年开户' },
    { id: 'C1102065437', name: '刘志强', age: 47, risk: '稳健型', occupation: '软件公司技术总监', assets: '380万元', contact: '13789012345', address: '西安市雁塔区高新路', vip: '白银客户', history: '2018年开户' },
];

// 生成初始审批数据
const generateInitialApprovals = () => {
    return Array.from({ length: 15 }, (_, index) => {
        // 随机选择客户
        const customerId = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)].id;
        
        // 随机选择产品类型和产品
        const productTypeIndex = Math.floor(Math.random() * PRODUCT_TYPES.length);
        const productType = PRODUCT_TYPES[productTypeIndex];
        
        let productList = [];
        
        switch(productType) {
            case '基金':
                productList = FUNDS;
                break;
            case '股票':
                productList = STOCKS;
                break;
            case '理财产品':
                productList = FINANCIAL_PRODUCTS;
                break;
        }
        
        const product = productList[Math.floor(Math.random() * productList.length)];
        
        // 生成订单金额
        const amount = (Math.random() * 100000 + 10000).toFixed(2);
        
        // 预先处理审批状态
        const approvalStatuses = [];
        
        // 确保有一些未审批订单（索引为3到6的记录）
        const forceCompliance = index >= 3 && index <= 6;
        
        // 为每个审批级别创建审批状态
        for (let levelIndex = 0; levelIndex < APPROVAL_LEVELS.length; levelIndex++) {
        const level = APPROVAL_LEVELS[levelIndex];
            
            // 对于强制未审批的记录，前两级始终通过，合规人员待审批
            if (forceCompliance) {
                if (levelIndex < 2) {
                    // 客户经理和风控人员审批通过
                    const daysAgo = 7 - levelIndex * 2 - Math.floor(Math.random() * 2);
                    const approvalDate = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
                    
                    approvalStatuses.push({
                        level,
                        approverId: `USER${Math.random().toString().slice(2, 8)}`,
                        decision: 'APPROVED',
                        comment: '审批通过',
                        approvalDate: approvalDate.toISOString(),
                        isApproved: true
                    });
                } else {
                    // 合规人员待审批
                    approvalStatuses.push({
                        level,
                        approverId: null,
                        decision: 'PENDING',
                        comment: '',
                        approvalDate: null,
                        isApproved: false
                    });
                }
            } else {
                // 正常随机流程
                const isApproved = Math.random() > 0.3;
                const decision = isApproved ? 'APPROVED' : 'REJECTED';
        const comment = decision === 'REJECTED'
                    ? ['材料不全', '风险过高', '金额超标', '客户风险承受能力不匹配', '超出投资限额'][Math.floor(Math.random() * 5)]
            : '审批通过';

                // 审批日期依次递增
                const daysAgo = 7 - levelIndex * 2 - Math.floor(Math.random() * 2);
                const approvalDate = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
                
                // 前面审批未通过则后面不处理
                if (levelIndex > 0 && approvalStatuses[levelIndex - 1] && !approvalStatuses[levelIndex - 1].isApproved) {
                    approvalStatuses.push({
            level,
                        approverId: null,
                        decision: 'PENDING',
                        comment: '等待前序审批',
                        approvalDate: null,
                        isApproved: false
                    });
                } else {
                    approvalStatuses.push({
                        level,
                        approverId: isApproved ? `USER${Math.random().toString().slice(2, 8)}` : null,
                        decision: isApproved ? 'APPROVED' : 'REJECTED',
            comment,
                        approvalDate: isApproved ? approvalDate.toISOString() : null,
                        isApproved
                    });
                }
            }
        }
        
        // 创建交易
        return {
            tradeId: `T${(1000000000 + index).toString().slice(1, 10)}`,
            customerId,
            productType,
            productId: product.id,
            productName: product.name,
            amount: `¥${amount}`,
            status: approvalStatuses[approvalStatuses.length - 1].decision === 'APPROVED' ? 'COMPLETED' : 
                   approvalStatuses[approvalStatuses.length - 1].decision === 'REJECTED' ? 'REJECTED' : 'IN_PROCESS',
            createdAt: new Date(Date.now() - (10 + Math.floor(Math.random() * 20)) * 24 * 3600 * 1000).toISOString(),
            approvals: approvalStatuses,
            productDetails: product
        };
    });
};

// 生成合规政策假数据
const generateCompliancePolicies = () => {
    const policies = [
        {
            policyId: 'CP202301-008',
            title: '交易风险评估管理办法(2023版)',
            description: '规定业务部门和风险管理部门对不同类型交易的风险评估标准和流程，确保交易活动合规、风险可控',
            effectiveDate: '2023-03-15',
            department: '合规管理部',
            version: 'v2.1',
            status: '生效中'
        },
        {
            policyId: 'CP202302-015',
            title: '客户信息管理与保密制度',
            description: '明确客户信息收集、存储、使用和保护的原则和操作规范，严格保障客户隐私和数据安全',
            effectiveDate: '2023-05-22',
            department: '数据安全部',
            version: 'v1.8',
            status: '生效中'
        },
        {
            policyId: 'CP202207-023',
            title: '产品销售合规操作指引',
            description: '规范从产品准入、客户风险评估到销售过程的各环节操作要求，防范销售误导和不当推介',
            effectiveDate: '2022-11-10',
            department: '合规管理部',
            version: 'v3.0',
            status: '生效中'
        },
        {
            policyId: 'CP202306-031',
            title: '反洗钱与反恐怖融资管理办法',
            description: '根据最新监管要求，详细规定客户身份识别、可疑交易监测和报告、资金来源审查等反洗钱工作流程',
            effectiveDate: '2023-06-01',
            department: '反洗钱中心',
            version: 'v2.5',
            status: '生效中'
        },
        {
            policyId: 'CP202304-042',
            title: '客户分类与风险评级管理规定',
            description: '基于客户资产状况、投资经验、风险偏好等维度对客户进行分类，实施差异化的风险管理措施',
            effectiveDate: '2023-05-18',
            department: '风险管理部',
            version: 'v1.2',
            status: '生效中'
        },
        {
            policyId: 'CP202302-037',
            title: '投资者适当性管理实施细则',
            description: '落实证监会投资者适当性管理规定，确保向客户销售与其风险承受能力相匹配的产品',
            effectiveDate: '2023-04-05',
            department: '零售业务部',
            version: 'v2.3',
            status: '生效中'
        },
        {
            policyId: 'CP202209-019',
            title: '利益冲突管理制度',
            description: '识别、防范和管理业务开展过程中可能出现的各类利益冲突，保障客户权益',
            effectiveDate: '2022-09-25',
            department: '内控合规部',
            version: 'v1.5',
            status: '生效中'
        }
    ];
    return policies;
};

// 生成操作日志假数据
const generateOperationLogs = () => {
    const operationTypes = [
        '查看交易详情',
        '审批通过订单',
        '审批驳回订单',
        '查询客户风险等级',
        '提交合规检查报告',
        '查看合规政策',
        '导出审批记录',
        '修改客户风险评级',
        '查询产品风险等级'
    ];
    
    const operators = [
        '张淑蓉(合规)', '李明宇(合规)', '王佳怡(合规)', '赵昕阳(合规)', '陈晓(合规主管)'
    ];
    
    return Array.from({ length: 20 }, (_, index) => {
        const timestamp = new Date(Date.now() - (Math.random() * 7 * 24 * 3600 * 1000));
        const dateStr = timestamp.toISOString();
        
        return {
            logId: `LOG${timestamp.getFullYear()}${(timestamp.getMonth()+1).toString().padStart(2, '0')}${timestamp.getDate().toString().padStart(2, '0')}${index+1}`,
            operator: operators[Math.floor(Math.random() * operators.length)],
            operatorId: `UID${Math.floor(Math.random() * 90000) + 10000}`,
        operation: operationTypes[Math.floor(Math.random() * operationTypes.length)],
            timestamp: dateStr,
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            result: Math.random() > 0.05 ? '成功' : '失败'
        };
    });
};

// 生成审计报告假数据
const generateAuditReports = () => {
    const reportTitles = [
        '金融产品合规销售专项审计',
        '客户风险评估合规性检查',
        '反洗钱工作合规性审计',
        '投资者适当性管理审计',
        '营业网点合规展业检查',
        '新产品上线前合规评估'
    ];
    
    const reportTypes = ['季度审计报告', '年度审计报告', '专项审计报告'];
    const departments = ['合规审计部', '内控检查部', '风险监测部', '合规管理部'];
    const auditors = ['张志强(审计)', '李雯雯(审计)', '王思远(审计)', '赵晓明(审计)', '刘涛(审计主管)'];
    
    return Array.from({ length: 8 }, (_, index) => {
        const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];
        const title = reportTitles[Math.floor(Math.random() * reportTitles.length)];
        const quarter = Math.floor(Math.random() * 4) + 1;
        const year = 2023 - Math.floor(Math.random() * 2);
        const reportDate = new Date(Date.now() - Math.random() * 180 * 24 * 3600 * 1000);
        
        return {
            reportId: `AR${year}${quarter}${index + 1}`,
            title: `${year}年${type === '季度审计报告' ? `第${quarter}季度` : ''} ${title}`,
            type: type,
            auditor: auditors[Math.floor(Math.random() * auditors.length)],
            auditorId: `UID${Math.floor(Math.random() * 90000) + 10000}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            reportDate: reportDate.toISOString(),
            summary: `本${type}对${title.replace('报告', '')}进行了全面检查，${
                Math.random() > 0.7 
                ? '总体合规情况良好，但在客户资料完整性、风险揭示书签署等方面存在改进空间。' 
                : Math.random() > 0.4
                ? '发现部分网点存在合规培训不到位、风险评级流于形式等问题，已要求限期整改。'
                : '流程执行基本规范，建议加强员工合规意识培训，进一步完善内控机制。'
            }`,
            status: Math.random() > 0.2 ? '已完成' : '进行中'
        };
    });
};

// 颜色映射保持为常量
const levelColorMap = {
    客户经理: 'blue',
    风控人员: 'purple',
    合规人员: 'cyan'
};

// 订单状态颜色映射
const statusColorMap = {
    COMPLETED: 'green',
    IN_PROCESS: 'orange',
    REJECTED: 'red',
    PENDING: 'blue'
};

const roleModules = {
    complianceOfficer: {
        menus: [
            {
                key: "pending",
                icon: <AuditOutlined />,
                label: "待审交易",
            },
            {
                key: "policies",
                icon: <FileSearchOutlined />,
                label: "合规政策",
            },
            {
                key: "logs",
                icon: <UserSwitchOutlined />,
                label: "操作日志",
            },
            {
                key: "reports",
                icon: <FileSearchOutlined />,
                label: "审计报告",
            },
        ],
        contentHeader: "合规人员工作台",
    },
};

const ComplianceOfficerHome = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 所有状态都必须在组件内部声明
    const [selectedKeys, setSelectedKeys] = useState(["pending"]);
    const [transactions, setTransactions] = useState(() => {
        const storedTransactions = localStorage.getItem('transactions');
        return storedTransactions ? JSON.parse(storedTransactions) : generateInitialApprovals();
    });
    const [policies, setPolicies] = useState(() => {
        const storedPolicies = localStorage.getItem('policies');
        return storedPolicies ? JSON.parse(storedPolicies) : generateCompliancePolicies();
    });
    const [logs, setLogs] = useState(() => {
        const storedLogs = localStorage.getItem('logs');
        return storedLogs ? JSON.parse(storedLogs) : generateOperationLogs();
    });
    const [reports, setReports] = useState(() => {
        const storedReports = localStorage.getItem('reports');
        return storedReports ? JSON.parse(storedReports) : generateAuditReports();
    });
    const [editRecord, setEditRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportDetailVisible, setReportDetailVisible] = useState(false);
    const [currentReport, setCurrentReport] = useState(null);
    const [detailInfo, setDetailInfo] = useState({
        type: '未知类型',
        details: null,
        customer: null
    });

    // 设置审批状态筛选
    const [approvalStatus, setApprovalStatus] = useState('pending'); // 默认显示待审批

    // 处理审批状态筛选变化
    const handleStatusFilterChange = (value) => {
        setApprovalStatus(value);
    };

    // 保存数据到localStorage的通用函数
    const saveToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            message.error(`保存${key}数据失败`);
        }
    };

    // 刷新数据
    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            // 生成新数据
            const newTransactions = generateInitialApprovals();
            const newPolicies = generateCompliancePolicies();
            const newLogs = generateOperationLogs();
            const newReports = generateAuditReports();
            
            // 更新状态
            setTransactions(newTransactions);
            setPolicies(newPolicies);
            setLogs([...logs, ...newLogs]); // 保留现有日志
            setReports(newReports);
            
            // 保存到localStorage
            saveToLocalStorage('transactions', newTransactions);
            saveToLocalStorage('policies', newPolicies);
            saveToLocalStorage('logs', [...logs, ...newLogs]);
            saveToLocalStorage('reports', newReports);
            
            setIsLoading(false);
            message.success('数据已刷新');
        }, 800);
    };

    

    // 获取筛选后的数据
    const filteredData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];
        
        return transactions.filter(item => {
            // 确保item和transactions存在
            if (!item || !item.approvals || !Array.isArray(item.approvals)) {
                return false;
            }
            
            // 对于合规人员，根据审批状态筛选
            const complianceApproval = item.approvals.find(a => a && a.level === '合规人员');
            
            if (approvalStatus === 'pending') {
                // 待审批：前两级已通过，合规级别待审批
                const managerApproval = item.approvals.find(a => a && a.level === '客户经理');
                const riskApproval = item.approvals.find(a => a && a.level === '风控人员');
                
                return managerApproval && riskApproval && 
                       managerApproval.decision === 'APPROVED' && 
                       riskApproval.decision === 'APPROVED' &&
                       complianceApproval && 
                       complianceApproval.decision === 'PENDING';
            } else if (approvalStatus === 'approved') {
                // 已通过：合规级别已审批通过
                return complianceApproval && complianceApproval.decision === 'APPROVED';
            } else if (approvalStatus === 'rejected') {
                // 已驳回：合规级别已审批驳回
                return complianceApproval && complianceApproval.decision === 'REJECTED';
            } else {
                // 全部：所有交易
                return true;
            }
        });
    }, [transactions, approvalStatus]);

    // 处理查看详情
    const handleViewDetails = (record) => {
        setCurrentRecord(record);
        
        // 查找对应产品
        let productInfo = null;
        if (record && record.productType && record.productId) {
            if (record.productType === '基金') {
                productInfo = FUNDS.find(fund => fund.id === record.productId) || null;
            } else if (record.productType === '股票') {
                productInfo = STOCKS.find(stock => stock.id === record.productId) || null;
            } else if (record.productType === '理财产品') {
                productInfo = FINANCIAL_PRODUCTS.find(product => product.id === record.productId) || null;
            }
        }
        
        // 查找客户信息
        let customerInfo = null;
        if (record && record.customerId) {
            customerInfo = CUSTOMERS.find(customer => customer.id === record.customerId) || {
                id: record.customerId,
                name: '未知客户',
                risk: '未知风险偏好',
                assets: '未知资产规模',
                contact: '未知联系方式'
            };
        } else {
            // 如果没有客户ID，创建一个默认客户信息对象
            customerInfo = {
                id: '未知ID',
                name: '未知客户',
                risk: '未知风险偏好',
                assets: '未知资产规模',
                contact: '未知联系方式'
            };
        }
        
        setDetailInfo({
            type: record?.productType || '未知类型',
            details: productInfo,
            customer: customerInfo
        });
        
        setDetailModalVisible(true);
        
        // 记录操作日志
        const newLog = {
            logId: `LOG${Date.now().toString().slice(-8)}`,
            operator: '当前用户',
            operatorId: 'CURRENT_USER',
            operation: '查看交易详情',
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1',
            result: '成功',
            details: `交易ID: ${record.tradeId}`
        };
        
        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        saveToLocalStorage('logs', updatedLogs);
    };

    // 处理审批提交
    const handleApprovalSubmit = () => {
        if (!editRecord || !editRecord.transactionId) {
            message.error('审批记录不完整，请重试');
            return;
        }

        // 查找并更新对应的交易记录
        const updatedTransactions = transactions.map(transaction => {
            if (transaction.tradeId === editRecord.transactionId) {
                // 更新对应的审批记录
                const updatedApprovals = transaction.approvals.map(approval => {
                    if (approval.level === '合规人员') {
                        return {
                            ...approval,
                            status: editRecord.decision === 'APPROVED' ? '已通过' : '已拒绝',
                            decision: editRecord.decision,
                            comment: editRecord.comment || (editRecord.decision === 'APPROVED' ? '审批通过' : '审批驳回'),
                            approverId: 'CURRENT_USER',
                            approvalDate: new Date().toISOString(),
                            timestamp: new Date().toISOString(),
                            isApproved: editRecord.decision === 'APPROVED'
                        };
                    }
                    return approval;
                });
                
                // 根据最后一个审批的状态更新交易状态
                let newStatus;
                if (editRecord.decision === 'REJECTED') {
                    newStatus = 'REJECTED';
                } else if (editRecord.decision === 'APPROVED') {
                    // 检查所有审批是否都通过
                    const allApproved = updatedApprovals.every(a => a.decision === 'APPROVED' || a.isApproved);
                    newStatus = allApproved ? 'COMPLETED' : 'IN_PROCESS';
                } else {
                    newStatus = transaction.status;
                }
                
                return {
                    ...transaction,
                    approvals: updatedApprovals,
                    status: newStatus
                };
            }
            return transaction;
        });

        // 保存到状态和localStorage
        setTransactions(updatedTransactions);
        saveToLocalStorage('transactions', updatedTransactions);
        
        // 记录操作日志
        const newLog = {
            logId: `LOG${Date.now().toString().slice(-8)}`,
            operator: '当前用户',
            operatorId: 'CURRENT_USER',
            operation: `${editRecord.decision === 'APPROVED' ? '审批通过' : '审批驳回'}交易`,
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1',
            result: '成功',
            details: `交易ID: ${editRecord.transactionId}`
        };
        
        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        saveToLocalStorage('logs', updatedLogs);
        
        message.success(`审批${editRecord.decision === 'APPROVED' ? '通过' : '驳回'}成功`);
        setIsModalVisible(false);
        setEditRecord(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setDetailModalVisible(false);
        setReportDetailVisible(false);
    };

    const handleDecisionChange = (value) => {
        setEditRecord({ ...editRecord, decision: value });
    };

    const handleCommentChange = (e) => {
        setEditRecord({ ...editRecord, comment: e.target.value });
    };
    
    // 查看审计报告详情
    const handleViewReport = (report) => {
        setCurrentReport(report);
        setReportDetailVisible(true);
        
        // 记录操作日志
        const newLog = {
            logId: `LOG${Date.now().toString().slice(-8)}`,
            operator: '当前用户',
            operatorId: 'CURRENT_USER',
            operation: '查看审计报告',
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1',
            result: '成功',
            details: `报告ID: ${report.reportId}`
        };
        
        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        saveToLocalStorage('logs', updatedLogs);
    };

    // 审批列表列配置
    const approvalColumns = [
        {
            title: '交易流水号',
            dataIndex: 'tradeId',
            width: 120,
            fixed: 'left'
        },
        {
            title: '产品类型',
            dataIndex: 'productType',
            width: 100,
            filters: PRODUCT_TYPES.map(type => ({ text: type, value: type })),
            onFilter: (value, record) => record && record.productType === value
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 180,
            ellipsis: true
        },
        {
            title: '交易金额',
            dataIndex: 'amount',
            width: 120,
            sorter: (a, b) => {
                if (!a || !a.amount || !b || !b.amount) return 0;
                return parseFloat(a.amount.replace('¥', '')) - parseFloat(b.amount.replace('¥', ''));
            }
        },
        {
            title: '客户经理审批',
            dataIndex: 'approvals',
            width: 150,
            render: (approvals) => {
                if (!approvals || !Array.isArray(approvals)) return <Tag color="gray">数据异常</Tag>;
                const approval = approvals.find(a => a && a.level === '客户经理');
                if (!approval) return <Tag color="gray">无数据</Tag>;
                
                if (approval.decision === 'REJECTED') {
                    return (
                        <Tooltip title={approval.comment || '无驳回原因'}>
                            <Tag color="red">驳回</Tag>
                        </Tooltip>
                    );
                }
                
                return <Tag color="green">通过</Tag>;
            }
        },
        {
            title: '风控人员审批',
            dataIndex: 'approvals',
            width: 150,
            render: (approvals) => {
                if (!approvals || !Array.isArray(approvals)) return <Tag color="gray">数据异常</Tag>;
                const approval = approvals.find(a => a && a.level === '风控人员');
                if (!approval) return <Tag color="gray">无数据</Tag>;
                
                if (approval.decision === 'REJECTED') {
                    return (
                        <Tooltip title={approval.comment || '无驳回原因'}>
                            <Tag color="red">驳回</Tag>
                        </Tooltip>
                    );
                }
                
                return <Tag color="green">通过</Tag>;
            }
        },
        {
            title: '合规人员审批',
            dataIndex: 'approvals',
            width: 150,
            render: (approvals) => {
                if (!approvals || !Array.isArray(approvals)) return <Tag color="gray">数据异常</Tag>;
                const approval = approvals.find(a => a && a.level === '合规人员');
                if (!approval) return <Tag color="gray">无数据</Tag>;
                
                if (approval.decision === 'PENDING') {
                    return <Tag color="blue">待审批</Tag>;
                }
                
                if (approval.decision === 'REJECTED') {
                    return (
                        <Tooltip title={approval.comment || '无驳回原因'}>
                            <Tag color="red">驳回</Tag>
                        </Tooltip>
                    );
                }
                
                return <Tag color="green">通过</Tag>;
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 180,
            render: (text) => text ? new Date(text).toLocaleString() : '无数据',
            sorter: (a, b) => {
                if (!a || !a.createdAt || !b || !b.createdAt) return 0;
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        },
        {
            title: '操作',
            width: 200,
            fixed: 'right',
            render: (_, record) => {
                if (!record || !record.approvals || !Array.isArray(record.approvals)) {
                    return null;
                }
                
                const complianceApproval = record.approvals.find(a => a && a.level === '合规人员');
                const canApprove = complianceApproval && complianceApproval.decision === 'PENDING';
                
                return (
                    <Space>
                    <Button
                            type="primary" 
                            size="small" 
                            icon={<EyeOutlined />} 
                            onClick={() => handleViewDetails(record)}
                        >
                            详情
                        </Button>
                        <Button
                            type={canApprove ? "primary" : "default"}
                            size="small"
                            disabled={!canApprove}
                        onClick={() => {
                                if (complianceApproval) {
                                    setEditRecord({
                                        transactionId: record.tradeId,
                                        decision: 'APPROVED',
                                        comment: '',
                                        ...complianceApproval
                                    });
                            setIsModalVisible(true);
                                }
                        }}
                    >
                            审批
                    </Button>
                    </Space>
                );
            }
        }
    ];

    // 合规政策列配置
    const policyColumns = [
        {
            title: '政策编号',
            dataIndex: 'policyId',
            width: 120
        },
        {
            title: '政策标题',
            dataIndex: 'title',
            width: 200
        },
        {
            title: '政策描述',
            dataIndex: 'description',
            width: 300,
            ellipsis: true
        },
        {
            title: '生效日期',
            dataIndex: 'effectiveDate',
            width: 120
        },
        {
            title: '所属部门',
            dataIndex: 'department',
            width: 120
        },
        {
            title: '版本',
            dataIndex: 'version',
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status) => (
                <Tag color="green">{status}</Tag>
            )
        }
    ];

    // 操作日志列配置
    const logColumns = [
        {
            title: '日志编号',
            dataIndex: 'logId',
            width: 120
        },
        {
            title: '操作人员',
            dataIndex: 'operator',
            width: 120
        },
        {
            title: '操作内容',
            dataIndex: 'operation',
            width: 150
        },
        {
            title: '操作时间',
            dataIndex: 'timestamp',
            width: 180,
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            defaultSortOrder: 'descend'
        },
        {
            title: 'IP地址',
            dataIndex: 'ipAddress',
            width: 150
        },
        {
            title: '操作结果',
            dataIndex: 'result',
            width: 100,
            render: (result) => (
                <Tag color={result === '成功' ? 'green' : 'red'}>{result}</Tag>
            )
        }
    ];

    // 审计报告表格列配置
    const auditReportColumns = [
        {
            title: '报告ID',
            dataIndex: 'reportId',
            key: 'reportId',
            width: 120,
        },
        {
            title: '报告类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
        },
        {
            title: '报告标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '审计人员',
            dataIndex: 'auditor',
            key: 'auditor',
            width: 120,
        },
        {
            title: '报告日期',
            dataIndex: 'reportDate',
            key: 'reportDate',
            width: 150,
            render: (text) => (text ? new Date(text).toLocaleString() : '无数据'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === '已完成' ? 'green' : 'blue'}>
                    {status}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button type="link" size="small" onClick={() => handleViewReport(record)}>查看</Button>
            )
        }
    ];

    const renderContent = () => {
        const moduleMap = {
            pending: (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                            <Title level={4}>待审交易</Title>
                            <Text type="secondary">显示所有待审批的交易记录，合规人员只能审批前两级已通过的交易</Text>
                        </Col>
                        <Col>
                            <Space>
                            <Select
                                    placeholder="审批状态"
                                    style={{ width: 150 }}
                                    value={approvalStatus}
                                    onChange={handleStatusFilterChange}
                                options={[
                                        { value: 'all', label: '全部' },
                                        { value: 'pending', label: '待审批' },
                                        { value: 'approved', label: '已通过' },
                                        { value: 'rejected', label: '已驳回' }
                                    ]}
                                />
                            </Space>
                        </Col>
                    </Row>
                    
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Card>
                                <Statistic 
                                    title="待审批交易" 
                                    value={transactions.filter(item => {
                                        if (!item || !item.approvals || !Array.isArray(item.approvals)) {
                                            return false;
                                        }
                                        // 查找合规人员审批
                                        const complianceApproval = item.approvals.find(a => a && a.level === '合规人员');
                                        // 查找前两级审批
                                        const managerApproval = item.approvals.find(a => a && a.level === '客户经理');
                                        const riskApproval = item.approvals.find(a => a && a.level === '风控人员');
                                        
                                        // 只有当前两级都通过，且合规人员待审批时才算
                                        return complianceApproval && 
                                               complianceApproval.decision === 'PENDING' && 
                                               managerApproval && managerApproval.decision === 'APPROVED' && 
                                               riskApproval && riskApproval.decision === 'APPROVED';
                                    }).length} 
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic 
                                    title="已通过交易" 
                                    value={transactions.filter(item => {
                                        if (!item || !item.approvals || !Array.isArray(item.approvals)) {
                                            return false;
                                        }
                                        const complianceApproval = item.approvals.find(a => a && a.level === '合规人员');
                                        return complianceApproval && complianceApproval.decision === 'APPROVED';
                                    }).length} 
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic 
                                    title="已驳回交易" 
                                    value={transactions.filter(item => {
                                        if (!item || !item.approvals || !Array.isArray(item.approvals)) {
                                            return false;
                                        }
                                        const complianceApproval = item.approvals.find(a => a && a.level === '合规人员');
                                        return complianceApproval && complianceApproval.decision === 'REJECTED';
                                    }).length} 
                                    valueStyle={{ color: '#f5222d' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic 
                                    title="当前筛选" 
                                    value={filteredData.length} 
                                    valueStyle={{ color: '#722ed1' }}
                                    suffix={<small style={{fontSize: '14px', color: '#666'}}>
                                        {approvalStatus === 'pending' ? '待审批' : 
                                         approvalStatus === 'approved' ? '已通过' : 
                                         approvalStatus === 'rejected' ? '已驳回' : '全部'}
                                    </small>}
                                />
                            </Card>
                        </Col>
                    </Row>
                    
                    <Table
                        rowKey="tradeId"
                        dataSource={filteredData}
                        columns={approvalColumns}
                        bordered
                        size="middle"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1500 }}
                        loading={isLoading}
                    />
                </div>
            ),
            policies: (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                            <Title level={4}>合规政策</Title>
                            <Text type="secondary">显示所有现行有效的合规政策文件</Text>
                        </Col>
                    </Row>
                <Table
                    rowKey="policyId"
                    dataSource={policies}
                    columns={policyColumns}
                    bordered
                    size="middle"
                    pagination={{ pageSize: 10 }}
                        scroll={{ x: 1200 }}
                        loading={isLoading}
                />
                </div>
            ),
            logs: (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                            <Title level={4}>操作日志</Title>
                            <Text type="secondary">显示系统中的所有操作记录</Text>
                        </Col>
                    </Row>
                <Table
                    rowKey="logId"
                    dataSource={logs}
                    columns={logColumns}
                    bordered
                    size="middle"
                    pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                        loading={isLoading}
                />
                </div>
            ),
            reports: (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                            <Title level={4}>审计报告</Title>
                            <Text type="secondary">显示所有合规审计报告</Text>
                        </Col>
                    </Row>
                <Table
                    rowKey="reportId"
                    dataSource={reports}
                        columns={auditReportColumns}
                    bordered
                    size="middle"
                    pagination={{ pageSize: 10 }}
                        scroll={{ x: 1200 }}
                        loading={isLoading}
                />
                </div>
            ),
            default: <div>请选择功能模块</div>
        };

        return moduleMap[selectedKeys[0]] || moduleMap.default;
    };

    // 找到特定客户
    const getCustomerById = (id) => {
        return CUSTOMERS.find(customer => customer.id === id) || {};
    };

    // 定义所有组件共用的标签样式
    const labelStyle = {
        width: '80px', 
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    
    // 产品信息展示组件
    const ProductInfoCard = ({ type, details }) => {
        if (!type || !details) {
            return <Card title="产品信息" bordered={false}><Empty description="无产品信息数据" /></Card>;
        }
        
        // 为不同产品类型定义标签颜色
        const getTypeColor = (productType) => {
            switch(productType) {
                case '基金': return 'blue';
                case '股票': return 'red';
                case '理财产品': return 'green';
                default: return 'default';
            }
        };
        
        // 为风险等级定义颜色
        const getRiskColor = (risk) => {
            if(!risk) return 'default';
            if(risk.includes('低')) return 'green';
            if(risk.includes('中')) return 'orange';
            if(risk.includes('高')) return 'red';
            return 'default';
        };
        
        return (
            <Card 
                title={
                    <Space>
                        <span>产品信息</span>
                        <Tag color={getTypeColor(type)}>{type}</Tag>
                    </Space>
                } 
                bordered={false}
            >
                <Card type="inner" title="基本信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                        <Descriptions.Item label="产品名称" span={2}><b>{details.name || '无数据'}</b></Descriptions.Item>
                        <Descriptions.Item label="产品代码">{details.id || details.code || '无数据'}</Descriptions.Item>
                        
                        {type === '股票' && (
                            <Descriptions.Item label="市场">{details.market || '无数据'}</Descriptions.Item>
                        )}
                        
                        {(type === '基金' || type === '理财产品') && (
                            <Descriptions.Item label="风险等级">
                                <Tag color={getRiskColor(details.risk)}>{details.risk || '无数据'}</Tag>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
                
                {type === '基金' && (
                    <Card type="inner" title="基金详情" style={{ marginBottom: 16 }}>
                        <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                            <Descriptions.Item label="基金经理">{details.manager || '无数据'}</Descriptions.Item>
                            <Descriptions.Item label="预期收益">{details.yield || '无数据'}</Descriptions.Item>
                            <Descriptions.Item label="投资期限">{details.period || '无数据'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
                
                {type === '股票' && (
                    <Card type="inner" title="股票详情" style={{ marginBottom: 16 }}>
                        <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                            <Descriptions.Item label="行业分类">{details.industry || '无数据'}</Descriptions.Item>
                            <Descriptions.Item label="当前价格">{details.price ? `¥${details.price}` : '无数据'}</Descriptions.Item>
                            <Descriptions.Item label="市盈率">{details.pe || '无数据'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
                
                {type === '理财产品' && (
                    <Card type="inner" title="理财详情" style={{ marginBottom: 16 }}>
                        <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                            <Descriptions.Item label="预期收益">{details.yield || '无数据'}</Descriptions.Item>
                            <Descriptions.Item label="投资期限">{details.period || '无数据'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
                
                <Card type="inner" title="产品描述">
                    <div style={{ padding: '8px 16px', lineHeight: '1.5' }}>
                        {details.description || '无产品描述'}
                    </div>
                </Card>
            </Card>
        );
    };

    // 客户信息展示组件
    const CustomerInfoCard = ({ customer }) => {
        if (!customer || Object.keys(customer).length === 0) {
            return <Card title="客户信息" bordered={false}>
                <Empty description="未找到客户信息" />
            </Card>;
        }
        
        // 获取风险偏好标签颜色
        const getRiskColor = (risk) => {
            if (!risk) return 'default';
            if (risk.includes('保守')) return 'green';
            if (risk.includes('稳健')) return 'blue';
            if (risk.includes('进取')) return 'orange';
            if (risk.includes('激进')) return 'red';
            return 'default';
        };
        
        return (
            <Card 
                title="客户信息"
                bordered={false}
            >
                <Card type="inner" title="基本信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                        <Descriptions.Item label="客户姓名"><b>{customer.name || '无数据'}</b></Descriptions.Item>
                        <Descriptions.Item label="客户编号">{customer.id || '无数据'}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{customer.age ? `${customer.age}岁` : '无数据'}</Descriptions.Item>
                        <Descriptions.Item label="开户历史">{customer.history || '无开户信息'}</Descriptions.Item>
                    </Descriptions>
                </Card>
                
                <Card type="inner" title="投资相关">
                    <Descriptions column={2} bordered size="small" layout="horizontal" labelStyle={labelStyle}>
                        <Descriptions.Item label="风险偏好">
                            <Tag color={getRiskColor(customer.risk)}>{customer.risk || '未知风险偏好'}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="资产规模">{customer.assets || '未知资产规模'}</Descriptions.Item>
                        <Descriptions.Item label="联系方式" span={2}>{customer.contact || '未知联系方式'}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Card>
        );
    };

    // 审批历史组件
    const ApprovalHistoryCard = ({ approvals }) => {
        if (!approvals || !Array.isArray(approvals) || approvals.length === 0) {
            return <Card title="审批历史" bordered={false}><Empty description="无审批历史数据" /></Card>;
        }
        
        // 审批人员姓名映射
        const approverNames = {
            '客户经理': ['张明轩', '李婉琪', '王俊杰', '赵雅芝', '陈宇航'],
            '风控人员': ['刘志远', '周倩雯', '孙建华', '吴天成', '郑海燕'],
            '合规人员': ['林正源', '杨文静', '钱思远', '黄嘉琪', '朱天宇']
        };
        
        // 获取审批状态颜色
        const getStatusColor = (decision) => {
            switch(decision) {
                case 'APPROVED': return 'green';
                case 'REJECTED': return 'red';
                case 'PENDING': return 'blue';
                default: return 'default';
            }
        };
        
        // 获取图标
        const getStatusIcon = (decision) => {
            switch(decision) {
                case 'APPROVED': return <Badge status="success" />;
                case 'REJECTED': return <Badge status="error" />;
                case 'PENDING': return <Badge status="processing" />;
                default: return <Badge status="default" />;
            }
        };
        
        return (
            <Card 
                title={
                    <Space>
                        <span>审批历史</span>
                        <Tag color="blue">{approvals.length}级审批</Tag>
                    </Space>
                } 
                bordered={false}
            >
                <Timeline mode="left">
                    {approvals.map((approval, index) => {
                        if (!approval) return null;
                        
                        // 根据审批级别和索引确定姓名
                        let approverName = '未知审批人';
                        
                        if (approval.level && approverNames[approval.level]) {
                            // 使用ID或索引的哈希值选择姓名
                            const nameList = approverNames[approval.level];
                            const nameIndex = approval.approverId ? 
                                parseInt(approval.approverId.slice(-4)) % nameList.length : 
                                index % nameList.length;
                            
                            approverName = nameList[nameIndex];
                        }
                        
                        // 审批状态
                        const status = approval.decision === 'APPROVED' ? '通过' : 
                                      approval.decision === 'REJECTED' ? '驳回' : '待审批';
                        
                        // 审批时间格式化
                        const formattedTime = approval.approvalDate 
                            ? new Date(approval.approvalDate).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            : '未审批';
                        
                        return (
                            <Timeline.Item 
                                key={index}
                                color={getStatusColor(approval.decision)}
                                label={formattedTime}
                                dot={getStatusIcon(approval.decision)}
                            >
                                <Card 
                                    size="small" 
                                    style={{ 
                                        marginBottom: 8, 
                                        borderLeft: `2px solid ${getStatusColor(approval.decision)}`,
                                        backgroundColor: approval.decision === 'PENDING' ? '#f9f9f9' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div>
                                            <b>{approval.level || '未知级别'}</b>
                                            <span style={{ margin: '0 8px' }}>|</span>
                                            <span>{approverName}</span>
                                        </div>
                                        <Tag color={getStatusColor(approval.decision)}>{status}</Tag>
                                    </div>
                                    
                                    {approval.comment && (
                                        <div style={{ 
                                            backgroundColor: '#f5f5f5', 
                                            padding: '8px 12px', 
                                            borderRadius: 4,
                                            marginTop: 8 
                                        }}>
                                            {approval.comment}
                                        </div>
                                    )}
                                </Card>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </Card>
        );
    };

    // 监听数据变化并保存到localStorage
    useEffect(() => {
        saveToLocalStorage('transactions', transactions);
        saveToLocalStorage('logs', logs);
        saveToLocalStorage('policies', policies);
        saveToLocalStorage('reports', reports);
    }, [transactions, logs, policies, reports]);

    return (
        <Layout>
            <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="logo" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginRight: '24px' }}>
                        银行订单审批系统
                    </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                        selectedKeys={selectedKeys}
                        items={roleModules.complianceOfficer.menus}
                        onSelect={({ key }) => setSelectedKeys([key])}
                        style={{ flex: 1, minWidth: '400px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge count={transactions.filter(item => {
                        if (!item || !item.approvals || !Array.isArray(item.approvals)) {
                            return false;
                        }
                        // 查找合规人员审批
                        const complianceApproval = item.approvals.find(a => a && a.level === '合规人员');
                        // 查找前两级审批
                        const managerApproval = item.approvals.find(a => a && a.level === '客户经理');
                        const riskApproval = item.approvals.find(a => a && a.level === '风控人员');
                        
                        // 只有当前两级都通过，且合规人员待审批时才算
                        return complianceApproval && 
                               complianceApproval.decision === 'PENDING' && 
                               managerApproval && managerApproval.decision === 'APPROVED' && 
                               riskApproval && riskApproval.decision === 'APPROVED';
                    }).length}>
                        <Button 
                            type="link" 
                            style={{ color: 'white' }}
                            onClick={() => {
                                setSelectedKeys(['pending']);
                                setApprovalStatus('pending');
                            }}
                        >
                            待审批
                        </Button>
                    </Badge>
                    <Logout />
                </div>
            </Header>
            <Layout>
                    <Content
                        style={{
                            padding: 24,
                        minHeight: "calc(100vh - 64px)",
                            background: colorBgContainer,
                        }}
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            
            {/* 审批弹窗 */}
            <Modal
                title="交易审批"
                open={isModalVisible}
                onOk={handleApprovalSubmit}
                onCancel={handleCancel}
                okText="提交审批"
                cancelText="取消"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <p><strong>交易流水号:</strong> {editRecord?.transactionId}</p>
                    </div>
                    <Divider />
                    <Select
                        placeholder="选择审批结果"
                        value={editRecord?.decision}
                        onChange={handleDecisionChange}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="APPROVED">通过</Select.Option>
                        <Select.Option value="REJECTED">驳回</Select.Option>
                    </Select>
                    <Input.TextArea
                        placeholder="审批意见"
                        value={editRecord?.comment}
                        onChange={handleCommentChange}
                        disabled={editRecord?.decision === 'APPROVED'}
                        rows={4}
                    />
                </Space>
            </Modal>
            
            {/* 交易详情模态框 */}
            <Modal
                title="交易详情"
                open={detailModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        关闭
                    </Button>,
                    <Button 
                        key="approve" 
                        type="primary" 
                        onClick={() => {
                            if (currentRecord) {
                                const complianceApproval = currentRecord.approvals && Array.isArray(currentRecord.approvals) ? 
                                    currentRecord.approvals.find(a => a && a.level === '合规人员') : null;
                                    
                                if (complianceApproval && complianceApproval.decision === 'PENDING') {
                                    setEditRecord({
                                        transactionId: currentRecord.tradeId,
                                        decision: 'APPROVED',
                                        comment: ''
                                    });
                                    setDetailModalVisible(false);
                                    setIsModalVisible(true);
                                } else {
                                    message.warning('当前交易不需要您审批或已完成审批');
                                }
                            }
                        }}
                    >
                        审批通过
                    </Button>,
                    <Button 
                        key="reject" 
                        type="primary" 
                        danger
                        onClick={() => {
                            if (currentRecord) {
                                const complianceApproval = currentRecord.approvals && Array.isArray(currentRecord.approvals) ? 
                                    currentRecord.approvals.find(a => a && a.level === '合规人员') : null;
                                    
                                if (complianceApproval && complianceApproval.decision === 'PENDING') {
                                    setEditRecord({
                                        transactionId: currentRecord.tradeId,
                                        decision: 'REJECTED',
                                        comment: ''
                                    });
                                    setDetailModalVisible(false);
                                    setIsModalVisible(true);
                                } else {
                                    message.warning('当前交易不需要您审批或已完成审批');
                                }
                            }
                        }}
                    >
                        审批驳回
                    </Button>
                ]}
                width={900}
            >
                {currentRecord && (
                    <div>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="交易信息" key="1">
                                <Descriptions title="交易基本信息" bordered column={3} size="small" layout="horizontal" labelStyle={labelStyle}>
                                    <Descriptions.Item label="流水号" span={2}>{currentRecord.tradeId}</Descriptions.Item>
                                    <Descriptions.Item label="状态">
                                        <Tag color={
                                            currentRecord.status === 'COMPLETED' ? 'green' : 
                                            currentRecord.status === 'REJECTED' ? 'red' : 'blue'
                                        }>
                                            {currentRecord.status === 'COMPLETED' ? '已完成' : 
                                            currentRecord.status === 'REJECTED' ? '已拒绝' : '处理中'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="金额">
                                        {typeof currentRecord.amount === 'string' 
                                            ? currentRecord.amount 
                                            : (currentRecord.amount 
                                                ? `¥${parseFloat(currentRecord.amount).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                                                : '无数据')
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item label="时间" span={2}>
                                        {currentRecord.createdAt 
                                            ? new Date(currentRecord.createdAt).toLocaleString('zh-CN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false
                                            }) 
                                            : '无数据'
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item label="产品类型">{currentRecord.productType || '无数据'}</Descriptions.Item>
                                    <Descriptions.Item label="产品名称" span={2}>{currentRecord.productName || '无数据'}</Descriptions.Item>
                                </Descriptions>
                            </TabPane>
                            
                            <TabPane tab="产品信息" key="2">
                                <ProductInfoCard type={detailInfo.type} details={detailInfo.details} />
                            </TabPane>
                            
                            <TabPane tab="客户信息" key="3">
                                <CustomerInfoCard customer={detailInfo.customer} />
                            </TabPane>
                            
                            <TabPane tab="审批历史" key="4">
                                <ApprovalHistoryCard approvals={currentRecord.approvals} />
                            </TabPane>
                        </Tabs>
                    </div>
                )}
            </Modal>
            
            {/* 审计报告详情弹窗 */}
            <Modal
                title="审计报告详情"
                open={reportDetailVisible}
                onCancel={handleCancel}
                width={800}
            >
                {currentReport && (
                    <>
                        <Descriptions title="审计报告详情" bordered column={2} size="small" layout="horizontal" labelStyle={labelStyle}>
                            <Descriptions.Item label="编号">{currentReport.reportId}</Descriptions.Item>
                            <Descriptions.Item label="标题">{currentReport.title}</Descriptions.Item>
                            <Descriptions.Item label="类型">{currentReport.type}</Descriptions.Item>
                            <Descriptions.Item label="审计人">{currentReport.auditor}</Descriptions.Item>
                            <Descriptions.Item label="部门">{currentReport.department}</Descriptions.Item>
                            <Descriptions.Item label="日期">
                                {currentReport.reportDate 
                                    ? new Date(currentReport.reportDate).toLocaleString('zh-CN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    }) 
                                    : '无数据'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="摘要" span={2}>{currentReport.summary}</Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Tag color={currentReport.status === '已完成' ? 'green' : 'blue'}>
                                    {currentReport.status}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>
        </Layout>
    );
};

export default ComplianceOfficerHome;    