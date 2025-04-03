// 客户数据
export const mockClients = [
  {
    id: 1,
    usrId: '100010000000123456',
    usrAccount: 'client1',
    name: '张三',
    gender: 'M',
    phoneNumber: '13800138001',
    nationality: '中国',
    idType: '身份证',
    idNumber: '110101199001010011',
    incomeLevel: '高收入',
    registerDate: '2023-01-15',
    kycCheckDate: '2024-01-15',
    status: '正常',
    remarks: '重要客户',
    riskLevel: '稳健型',
    totalAssets: 1500000.00,
    balance: 1500000.00,
    investmentPreference: '均衡配置',
    relationshipManagerId: 'U00012345678'
  },
  {
    id: 2,
    usrId: '100010000000123457',
    usrAccount: 'client2',
    name: '李四',
    gender: 'M',
    phoneNumber: '13900139001',
    nationality: '中国',
    idType: '身份证',
    idNumber: '110101199002020022',
    incomeLevel: '中等收入',
    registerDate: '2023-02-20',
    kycCheckDate: '2024-02-20',
    status: '正常',
    remarks: '新客户',
    riskLevel: '保守型',
    totalAssets: 800000.00,
    balance: 800000.00,
    investmentPreference: '稳健理财',
    relationshipManagerId: 'U00012345679'
  },
  {
    id: 3,
    usrId: '100010000000123458',
    usrAccount: 'client3',
    name: '王五',
    gender: 'M',
    phoneNumber: '13700137001',
    nationality: '中国',
    idType: '身份证',
    idNumber: '110101199003030033',
    incomeLevel: '高收入',
    registerDate: '2022-12-05',
    kycCheckDate: '2023-12-05',
    status: '正常',
    remarks: 'VIP客户',
    riskLevel: '进取型',
    totalAssets: 3000000.00,
    balance: 3000000.00,
    investmentPreference: '股票为主',
    relationshipManagerId: 'U00012345678'
  },
  {
    id: 4,
    usrId: '100010000000123459',
    usrAccount: 'client4',
    name: '赵六',
    gender: 'F',
    phoneNumber: '13600136001',
    nationality: '中国',
    idType: '身份证',
    idNumber: '110101199004040044',
    incomeLevel: '中等收入',
    registerDate: '2023-03-18',
    kycCheckDate: '2024-03-18',
    status: '正常',
    remarks: '',
    riskLevel: '稳健型',
    totalAssets: 1200000.00,
    balance: 1200000.00,
    investmentPreference: '均衡配置',
    relationshipManagerId: 'U00012345679'
  }
];

// 投资组合数据
export const mockPortfolios = [
  {
    id: 1,
    clientId: 1,
    name: '稳健增长组合',
    totalValue: 1450000,
    dailyChange: 7580,
    dailyChangePercent: 0.52,
    holdings: [
      {
        symbol: 'AAPL',
        name: '苹果公司',
        shares: 100,
        value: 180000,
        change: 2160,
        changePercent: 1.21
      },
      {
        symbol: 'MSFT',
        name: '微软公司',
        shares: 150,
        value: 620000,
        change: 3720,
        changePercent: 0.60
      },
      {
        symbol: 'F001',
        name: '稳健债券基金',
        shares: 5000,
        value: 300000,
        change: 750,
        changePercent: 0.25
      },
      {
        symbol: 'F002',
        name: '创新科技基金',
        shares: 3000,
        value: 350000,
        change: 950,
        changePercent: 0.27
      }
    ]
  },
  {
    id: 2,
    clientId: 2,
    name: '保守型组合',
    totalValue: 788000,
    dailyChange: 1970,
    dailyChangePercent: 0.25,
    holdings: [
      {
        symbol: 'F001',
        name: '稳健债券基金',
        shares: 8000,
        value: 480000,
        change: 1200,
        changePercent: 0.25
      },
      {
        symbol: 'P001',
        name: '固定收益理财',
        shares: 300000,
        value: 308000,
        change: 770,
        changePercent: 0.25
      }
    ]
  },
  {
    id: 3,
    clientId: 3,
    name: '进取增长组合',
    totalValue: 2980000,
    dailyChange: -59600,
    dailyChangePercent: -1.96,
    holdings: [
      {
        symbol: 'TSLA',
        name: '特斯拉',
        shares: 500,
        value: 1000000,
        change: -35000,
        changePercent: -3.38
      },
      {
        symbol: 'NVDA',
        name: '英伟达',
        shares: 450,
        value: 1350000,
        change: -27000,
        changePercent: -1.96
      },
      {
        symbol: 'F003',
        name: '新兴市场基金',
        shares: 10000,
        value: 630000,
        change: 2400,
        changePercent: 0.38
      }
    ]
  },
  {
    id: 4,
    clientId: 4,
    name: '稳健均衡组合',
    totalValue: 1190000,
    dailyChange: 3570,
    dailyChangePercent: 0.30,
    holdings: [
      {
        symbol: 'AAPL',
        name: '苹果公司',
        shares: 50,
        value: 90000,
        change: 1080,
        changePercent: 1.21
      },
      {
        symbol: 'F001',
        name: '稳健债券基金',
        shares: 6000,
        value: 360000,
        change: 900,
        changePercent: 0.25
      },
      {
        symbol: 'F004',
        name: '蓝筹股票基金',
        shares: 8000,
        value: 480000,
        change: 1440,
        changePercent: 0.30
      },
      {
        symbol: 'P001',
        name: '固定收益理财',
        shares: 260000,
        value: 260000,
        change: 150,
        changePercent: 0.06
      }
    ]
  }
];

// 产品数据
export const mockProducts = {
  // 基金产品
  funds: [
    {
      id: 'F001',
      name: '稳健债券基金',
      type: '基金',
      subType: '债券型',
      riskLevel: '低',
      currency: 'CNY',
      nav: 60.25,
      navDate: '2024-04-01',
      yieldRate: {
        month: 0.5,
        threeMonth: 1.8,
        sixMonth: 3.2,
        year: 5.5,
        threeYear: 16.8
      },
      minAmount: 50000,
      description: '投资于国内外各类债券，追求稳定收益和本金安全',
      manager: '王丽',
      establishDate: '2015-06-10',
      scale: 58.6, // 亿元
      status: '可交易'
    },
    {
      id: 'F002',
      name: '创新科技基金',
      type: '基金',
      subType: '股票型',
      riskLevel: '高',
      currency: 'CNY',
      nav: 116.78,
      navDate: '2024-04-01',
      yieldRate: {
        month: -2.1,
        threeMonth: 5.8,
        sixMonth: 12.2,
        year: 25.5,
        threeYear: 85.8
      },
      minAmount: 100000,
      description: '重点投资于科技创新领域的上市公司，追求高成长',
      manager: '刘强',
      establishDate: '2018-03-15',
      scale: 32.8, // 亿元
      status: '可交易'
    },
    {
      id: 'F003',
      name: '新兴市场基金',
      type: '基金',
      subType: '指数型',
      riskLevel: '高',
      currency: 'CNY',
      nav: 63.05,
      navDate: '2024-04-01',
      yieldRate: {
        month: 1.2,
        threeMonth: 3.5,
        sixMonth: 8.7,
        year: 15.3,
        threeYear: 42.8
      },
      minAmount: 80000,
      description: '跟踪新兴市场指数，分散投资于各新兴经济体',
      manager: '张明',
      establishDate: '2016-08-20',
      scale: 45.2, // 亿元
      status: '可交易'
    },
    {
      id: 'F004',
      name: '蓝筹股票基金',
      type: '基金',
      subType: '股票型',
      riskLevel: '中',
      currency: 'CNY',
      nav: 60.02,
      navDate: '2024-04-01',
      yieldRate: {
        month: 0.8,
        threeMonth: 3.2,
        sixMonth: 6.5,
        year: 12.8,
        threeYear: 38.5
      },
      minAmount: 70000,
      description: '投资于大型蓝筹股，追求稳定增长与分红',
      manager: '李华',
      establishDate: '2014-05-08',
      scale: 76.5, // 亿元
      status: '可交易'
    }
  ],
  
  // 股票产品
  stocks: [
    {
      id: 'S001',
      symbol: 'AAPL',
      name: '苹果公司',
      type: '股票',
      riskLevel: '中',
      currency: 'USD',
      price: 180.25,
      changePct: 1.21,
      change: 2.16,
      marketCap: 2850, // 十亿美元
      pe: 28.5,
      eps: 6.32,
      dividend: 0.92, // 股息率%
      sector: '科技',
      description: '全球领先的消费电子设备、软件和服务提供商',
      status: '可交易'
    },
    {
      id: 'S002',
      symbol: 'MSFT',
      name: '微软公司',
      type: '股票',
      riskLevel: '中',
      currency: 'USD',
      price: 413.64,
      changePct: 0.60,
      change: 2.48,
      marketCap: 3080, // 十亿美元
      pe: 35.2,
      eps: 11.75,
      dividend: 0.85, // 股息率%
      sector: '科技',
      description: '全球领先的软件和云服务提供商',
      status: '可交易'
    },
    {
      id: 'S003',
      symbol: 'TSLA',
      name: '特斯拉',
      type: '股票',
      riskLevel: '高',
      currency: 'USD',
      price: 200.25,
      changePct: -3.38,
      change: -7.01,
      marketCap: 636, // 十亿美元
      pe: 55.8,
      eps: 3.58,
      dividend: 0, // 股息率%
      sector: '汽车',
      description: '电动汽车和清洁能源公司',
      status: '可交易'
    },
    {
      id: 'S004',
      symbol: 'NVDA',
      name: '英伟达',
      type: '股票',
      riskLevel: '高',
      currency: 'USD',
      price: 955.73,
      changePct: -1.96,
      change: -19.05,
      marketCap: 2360, // 十亿美元
      pe: 90.2,
      eps: 10.59,
      dividend: 0.05, // 股息率%
      sector: '半导体',
      description: '专注于人工智能计算的图形处理器设计公司',
      status: '可交易'
    }
  ],
  
  // 理财产品
  financialProducts: [
    {
      id: 'P001',
      name: '安心收益理财',
      type: '理财产品',
      subType: '固定收益',
      riskLevel: '低',
      currency: 'CNY',
      expectedReturn: 3.8, // 年化收益率%
      term: 180, // 天
      minAmount: 200000,
      issuer: '建设银行',
      description: '银行发行的固定收益理财产品，投资于债券和货币市场',
      subscriptionStartDate: '2024-04-01',
      subscriptionEndDate: '2024-04-15',
      valueDate: '2024-04-20',
      maturityDate: '2024-10-17',
      status: '募集中'
    },
    {
      id: 'P002',
      name: '进取增利理财',
      type: '理财产品',
      subType: '浮动收益',
      riskLevel: '中',
      currency: 'CNY',
      expectedReturn: 5.2, // 年化收益率%
      term: 365, // 天
      minAmount: 500000,
      issuer: '工商银行',
      description: '混合投资型理财产品，投资于债券、股票和其他金融资产',
      subscriptionStartDate: '2024-03-15',
      subscriptionEndDate: '2024-04-05',
      valueDate: '2024-04-10',
      maturityDate: '2025-04-10',
      status: '募集中'
    },
    {
      id: 'P003',
      name: '私享定制理财',
      type: '理财产品',
      subType: '混合型',
      riskLevel: '中高',
      currency: 'CNY',
      expectedReturn: 6.5, // 年化收益率%
      term: 720, // 天
      minAmount: 1000000,
      issuer: '中国银行',
      description: '针对高净值客户的定制化理财产品，投资多元化资产配置',
      subscriptionStartDate: '2024-03-20',
      subscriptionEndDate: '2024-04-10',
      valueDate: '2024-04-15',
      maturityDate: '2026-04-05',
      status: '募集中'
    },
    {
      id: 'P004',
      name: '稳赢月月盈',
      type: '理财产品',
      subType: '定期开放',
      riskLevel: '低',
      currency: 'CNY',
      expectedReturn: 3.5, // 年化收益率%
      term: 30, // 天
      minAmount: 100000,
      issuer: '招商银行',
      description: '每月开放申购和赎回的低风险理财产品',
      subscriptionStartDate: '2024-04-01',
      subscriptionEndDate: '2024-04-05',
      valueDate: '2024-04-08',
      maturityDate: '2024-05-08',
      status: '可交易'
    }
  ]
};

// 交易数据
export const mockTransactions = [
  {
    id: 1,
    tradeId: 'T20240401001',
    clientId: 1,
    clientName: '张三',
    productId: 'F001',
    productName: '稳健债券基金',
    productType: '基金',
    type: '申购',
    amount: 100000,
    status: '已完成',
    managerApprovalStatus: '已批准',
    managerApprovalTime: '2024-04-01 09:45:00',
    riskApprovalStatus: '已批准',
    riskApprovalTime: '2024-04-01 10:15:00',
    complianceApprovalStatus: '已批准',
    complianceApprovalTime: '2024-04-01 10:30:00',
    createTime: '2024-04-01 09:15:00',
    updateTime: '2024-04-01 10:30:00'
  },
  {
    id: 2,
    tradeId: 'T20240401002',
    clientId: 3,
    clientName: '王五',
    productId: 'S003',
    productName: '特斯拉',
    productType: '股票',
    type: '买入',
    amount: 200000,
    status: '已完成',
    managerApprovalStatus: '已批准',
    managerApprovalTime: '2024-04-01 11:30:00',
    riskApprovalStatus: '已批准',
    riskApprovalTime: '2024-04-01 13:45:00',
    complianceApprovalStatus: '已批准',
    complianceApprovalTime: '2024-04-01 14:30:00',
    createTime: '2024-04-01 11:00:00',
    updateTime: '2024-04-01 14:30:00'
  },
  {
    id: 3,
    tradeId: 'T20240402001',
    clientId: 2,
    clientName: '李四',
    productId: 'P001',
    productName: '安心收益理财',
    productType: '理财产品',
    type: '申购',
    amount: 300000,
    status: '审批中',
    managerApprovalStatus: '已批准',
    managerApprovalTime: '2024-04-02 10:30:00',
    riskApprovalStatus: '已批准',
    riskApprovalTime: '2024-04-02 14:15:00',
    complianceApprovalStatus: '待审批',
    complianceApprovalTime: null,
    createTime: '2024-04-02 09:30:00',
    updateTime: '2024-04-02 14:15:00'
  },
  {
    id: 4,
    tradeId: 'T20240402002',
    clientId: 4,
    clientName: '赵六',
    productId: 'F004',
    productName: '蓝筹股票基金',
    productType: '基金',
    type: '申购',
    amount: 150000,
    status: '审批中',
    managerApprovalStatus: '已批准',
    managerApprovalTime: '2024-04-02 15:45:00',
    riskApprovalStatus: '待审批',
    riskApprovalTime: null,
    complianceApprovalStatus: '待审批',
    complianceApprovalTime: null,
    createTime: '2024-04-02 15:00:00',
    updateTime: '2024-04-02 15:45:00'
  },
  {
    id: 5,
    tradeId: 'T20240403001',
    clientId: 1,
    clientName: '张三',
    productId: 'F001',
    productName: '稳健债券基金',
    productType: '基金',
    type: '赎回',
    amount: 50000,
    status: '审批中',
    managerApprovalStatus: '待审批',
    managerApprovalTime: null,
    riskApprovalStatus: '待审批',
    riskApprovalTime: null,
    complianceApprovalStatus: '待审批',
    complianceApprovalTime: null,
    createTime: '2024-04-03 09:00:00',
    updateTime: '2024-04-03 09:00:00'
  }
];

// 推荐请求数据
export const mockRecommendationRequests = [
  {
    id: 1,
    requestId: 'R20240401001',
    clientId: 1,
    clientName: '张三',
    riskLevel: '稳健型',
    totalAssets: 1500000,
    requestType: '投资咨询',
    investmentGoal: '稳定收益',
    preferredProducts: ['基金', '理财产品'],
    investmentAmount: 200000,
    status: '已处理',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-01 08:30:00',
    updateTime: '2024-04-01 09:30:00',
    remarks: '客户希望获得稳定的收益，风险承受能力一般'
  },
  {
    id: 2,
    requestId: 'R20240401002',
    clientId: 3,
    clientName: '王五',
    riskLevel: '进取型',
    totalAssets: 3000000,
    requestType: '产品咨询',
    investmentGoal: '高收益',
    preferredProducts: ['股票', '基金'],
    investmentAmount: 500000,
    status: '已处理',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-01 10:15:00',
    updateTime: '2024-04-01 11:30:00',
    remarks: '客户希望投资高科技股票，愿意承担高风险'
  },
  {
    id: 3,
    requestId: 'R20240402001',
    clientId: 2,
    clientName: '李四',
    riskLevel: '保守型',
    totalAssets: 800000,
    requestType: '投资咨询',
    investmentGoal: '保本增值',
    preferredProducts: ['理财产品'],
    investmentAmount: 300000,
    status: '已处理',
    managerId: 'U00012345679',
    managerName: '陈经理',
    createTime: '2024-04-02 09:00:00',
    updateTime: '2024-04-02 10:00:00',
    remarks: '客户希望保证本金安全，追求稳定的回报'
  },
  {
    id: 4,
    requestId: 'R20240402002',
    clientId: 4,
    clientName: '赵六',
    riskLevel: '稳健型',
    totalAssets: 1200000,
    requestType: '产品咨询',
    investmentGoal: '均衡增长',
    preferredProducts: ['基金', '理财产品'],
    investmentAmount: 200000,
    status: '已处理',
    managerId: 'U00012345679',
    managerName: '陈经理',
    createTime: '2024-04-02 14:30:00',
    updateTime: '2024-04-02 15:45:00',
    remarks: '客户希望分散投资，均衡增长'
  },
  {
    id: 5,
    requestId: 'R20240403001',
    clientId: 1,
    clientName: '张三',
    riskLevel: '稳健型',
    totalAssets: 1450000,
    requestType: '投资咨询',
    investmentGoal: '现金管理',
    preferredProducts: ['理财产品'],
    investmentAmount: 100000,
    status: '处理中',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-03 08:45:00',
    updateTime: '2024-04-03 08:45:00',
    remarks: '客户希望进行短期现金管理'
  }
];

// 产品推荐数据
export const mockRecommendations = [
  {
    id: 1,
    recommendationId: 'PR20240401001',
    requestId: 'R20240401001',
    clientId: 1,
    clientName: '张三',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-01 09:15:00',
    updateTime: '2024-04-01 09:30:00',
    status: '已接受',
    clientResponseTime: '2024-04-01 09:45:00',
    recommendedProducts: [
      {
        productId: 'F001',
        productName: '稳健债券基金',
        productType: '基金',
        recommendedAmount: 100000,
        recommendationReason: '该基金风险较低，符合客户稳健型风险偏好，历史收益稳定'
      },
      {
        productId: 'P001',
        productName: '安心收益理财',
        productType: '理财产品',
        recommendedAmount: 100000,
        recommendationReason: '固定收益类产品，期限适中，收益稳定，适合客户风险偏好'
      }
    ]
  },
  {
    id: 2,
    recommendationId: 'PR20240401002',
    requestId: 'R20240401002',
    clientId: 3,
    clientName: '王五',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-01 11:00:00',
    updateTime: '2024-04-01 11:30:00',
    status: '已接受',
    clientResponseTime: '2024-04-01 11:45:00',
    recommendedProducts: [
      {
        productId: 'S003',
        productName: '特斯拉',
        productType: '股票',
        recommendedAmount: 200000,
        recommendationReason: '高科技成长股，符合客户高收益偏好，具有较高增长潜力'
      },
      {
        productId: 'F003',
        productName: '新兴市场基金',
        productType: '基金',
        recommendedAmount: 300000,
        recommendationReason: '投资新兴市场，预期收益较高，与客户风险承受能力匹配'
      }
    ]
  },
  {
    id: 3,
    recommendationId: 'PR20240402001',
    requestId: 'R20240402001',
    clientId: 2,
    clientName: '李四',
    managerId: 'U00012345679',
    managerName: '陈经理',
    createTime: '2024-04-02 09:45:00',
    updateTime: '2024-04-02 10:00:00',
    status: '已接受',
    clientResponseTime: '2024-04-02 10:15:00',
    recommendedProducts: [
      {
        productId: 'P001',
        productName: '安心收益理财',
        productType: '理财产品',
        recommendedAmount: 300000,
        recommendationReason: '低风险固定收益产品，保障本金安全，符合客户保守型风险偏好'
      }
    ]
  },
  {
    id: 4,
    recommendationId: 'PR20240402002',
    requestId: 'R20240402002',
    clientId: 4,
    clientName: '赵六',
    managerId: 'U00012345679',
    managerName: '陈经理',
    createTime: '2024-04-02 15:30:00',
    updateTime: '2024-04-02 15:45:00',
    status: '已接受',
    clientResponseTime: '2024-04-02 16:00:00',
    recommendedProducts: [
      {
        productId: 'F004',
        productName: '蓝筹股票基金',
        productType: '基金',
        recommendedAmount: 150000,
        recommendationReason: '投资于稳健的蓝筹股，风险适中，符合客户稳健型风险偏好'
      },
      {
        productId: 'P004',
        productName: '稳赢月月盈',
        productType: '理财产品',
        recommendedAmount: 50000,
        recommendationReason: '短期理财产品，流动性好，收益稳定'
      }
    ]
  },
  {
    id: 5,
    recommendationId: 'PR20240403001',
    requestId: 'R20240403001',
    clientId: 1,
    clientName: '张三',
    managerId: 'U00012345678',
    managerName: '周经理',
    createTime: '2024-04-03 09:30:00',
    updateTime: '2024-04-03 09:30:00',
    status: '待响应',
    clientResponseTime: null,
    recommendedProducts: [
      {
        productId: 'P004',
        productName: '稳赢月月盈',
        productType: '理财产品',
        recommendedAmount: 100000,
        recommendationReason: '期限短、流动性好的理财产品，适合客户现金管理需求'
      }
    ]
  }
];

// KYC评估数据
export const mockKycRecords = [
  {
    id: 1,
    kycId: 'KYC20231015001',
    clientId: 1,
    clientName: '张三',
    assessmentDate: '2023-01-15',
    nextAssessmentDate: '2024-01-15',
    initialRiskLevel: '稳健型',
    finalRiskLevel: '稳健型',
    investmentExperience: '3-5年',
    incomeLevel: '高收入',
    liquidAssets: 2000000,
    investmentGoals: ['稳定收益', '资产保值'],
    investmentHorizon: '3-5年',
    riskTolerance: '中等',
    status: '已完成',
    assessor: '周经理',
    remarks: '客户风险承受能力中等，适合稳健型投资产品'
  },
  {
    id: 2,
    kycId: 'KYC20230220001',
    clientId: 2,
    clientName: '李四',
    assessmentDate: '2023-02-20',
    nextAssessmentDate: '2024-02-20',
    initialRiskLevel: '保守型',
    finalRiskLevel: '保守型',
    investmentExperience: '1-3年',
    incomeLevel: '中等收入',
    liquidAssets: 1000000,
    investmentGoals: ['保本增值', '退休规划'],
    investmentHorizon: '1-3年',
    riskTolerance: '低',
    status: '已完成',
    assessor: '陈经理',
    remarks: '客户风险承受能力低，注重本金安全，适合保守型产品'
  },
  {
    id: 3,
    kycId: 'KYC20221205001',
    clientId: 3,
    clientName: '王五',
    assessmentDate: '2022-12-05',
    nextAssessmentDate: '2023-12-05',
    initialRiskLevel: '进取型',
    finalRiskLevel: '进取型',
    investmentExperience: '5年以上',
    incomeLevel: '高收入',
    liquidAssets: 3500000,
    investmentGoals: ['长期资本增值', '财富积累'],
    investmentHorizon: '5年以上',
    riskTolerance: '高',
    status: '已完成',
    assessor: '周经理',
    remarks: '客户风险承受能力强，愿意承担高风险以获取高回报'
  },
  {
    id: 4,
    kycId: 'KYC20230318001',
    clientId: 4,
    clientName: '赵六',
    assessmentDate: '2023-03-18',
    nextAssessmentDate: '2024-03-18',
    initialRiskLevel: '稳健型',
    finalRiskLevel: '稳健型',
    investmentExperience: '3-5年',
    incomeLevel: '中等收入',
    liquidAssets: 1500000,
    investmentGoals: ['均衡增长', '子女教育'],
    investmentHorizon: '3-5年',
    riskTolerance: '中等',
    status: '已完成',
    assessor: '陈经理',
    remarks: '客户有明确的投资目标，风险偏好适中'
  },
  {
    id: 5,
    kycId: 'KYC20230605001',
    clientId: 1,
    clientName: '张三',
    assessmentDate: '2023-07-05',
    nextAssessmentDate: '2024-07-05',
    initialRiskLevel: '稳健型',
    finalRiskLevel: '稳健型',
    investmentExperience: '3-5年',
    incomeLevel: '高收入',
    liquidAssets: 2200000,
    investmentGoals: ['稳定收益', '资产保值'],
    investmentHorizon: '3-5年',
    riskTolerance: '中等',
    status: '已完成',
    assessor: '周经理',
    remarks: '半年度复核评估，客户风险偏好无变化'
  }
];

// 市场数据
export const mockMarketData = {
  indices: [
    {
      name: '上证指数',
      value: 3078.71,
      change: 28.65,
      changePercent: 0.94
    },
    {
      name: '深证成指',
      value: 10124.15,
      change: 115.83,
      changePercent: 1.16
    },
    {
      name: '创业板指',
      value: 1985.53,
      change: 28.21,
      changePercent: 1.44
    },
    {
      name: '沪深300',
      value: 3693.98,
      change: 37.68,
      changePercent: 1.03
    },
    {
      name: '道琼斯工业指数',
      value: 39512.13,
      change: 401.37,
      changePercent: 1.03
    },
    {
      name: '纳斯达克指数',
      value: 16340.09,
      change: 202.58,
      changePercent: 1.26
    },
    {
      name: '标普500指数',
      value: 5224.62,
      change: 46.11,
      changePercent: 0.89
    }
  ],
  topGainers: [
    {
      symbol: 'TSLA',
      name: '特斯拉',
      price: 200.00,
      change: 10.00,
      changePercent: 5.26
    },
    {
      symbol: 'NVDA',
      name: '英伟达',
      price: 950.00,
      change: 25.00,
      changePercent: 2.70
    },
    {
      symbol: '600519',
      name: '贵州茅台',
      price: 1620.55,
      change: 28.66,
      changePercent: 1.80
    },
    {
      symbol: '601899',
      name: '紫金矿业',
      price: 10.32,
      change: 0.18,
      changePercent: 1.78
    },
    {
      symbol: '603259',
      name: '药明康德',
      price: 68.80,
      change: 1.15,
      changePercent: 1.70
    }
  ],
  topLosers: [
    {
      symbol: 'AAPL',
      name: '苹果公司',
      price: 180.00,
      change: -2.00,
      changePercent: -1.10
    },
    {
      symbol: 'MSFT',
      name: '微软公司',
      price: 420.00,
      change: -3.00,
      changePercent: -0.71
    },
    {
      symbol: '601088',
      name: '中国神华',
      price: 21.78,
      change: -0.42,
      changePercent: -1.89
    },
    {
      symbol: '600036',
      name: '招商银行',
      price: 37.91,
      change: -0.69,
      changePercent: -1.79
    },
    {
      symbol: '000333',
      name: '美的集团',
      price: 56.65,
      change: -0.95,
      changePercent: -1.65
    }
  ],
  news: [
    {
      id: 1,
      title: '央行重磅发声：保持流动性合理充裕',
      date: '2024-04-11',
      source: '经济日报',
      url: '#'
    },
    {
      id: 2,
      title: '两市震荡上行，科技板块领涨',
      date: '2024-04-11',
      source: '证券时报',
      url: '#'
    },
    {
      id: 3,
      title: '多部委释放支持制造业发展政策信号',
      date: '2024-04-11',
      source: '上海证券报',
      url: '#'
    },
    {
      id: 4,
      title: '外资连续三日净流入A股市场',
      date: '2024-04-10',
      source: '中国证券报',
      url: '#'
    },
    {
      id: 5,
      title: '半导体产业链持续回暖，机构看好长期发展',
      date: '2024-04-10',
      source: '证券日报',
      url: '#'
    }
  ],
  calendar: [
    {
      id: 1,
      title: '3月CPI、PPI数据公布',
      date: '2024-04-12',
      impact: '高'
    },
    {
      id: 2,
      title: '一季度GDP初值公布',
      date: '2024-04-16',
      impact: '高'
    },
    {
      id: 3,
      title: '美联储公布褐皮书',
      date: '2024-04-17',
      impact: '中'
    },
    {
      id: 4,
      title: '3月金融数据公布',
      date: '2024-04-15',
      impact: '中'
    },
    {
      id: 5,
      title: '欧洲央行利率决议',
      date: '2024-04-18',
      impact: '高'
    }
  ]
};

// 风险分析数据
export const mockRiskData = {
  portfolioRisk: {
    beta: 1.23,
    volatility: 0.15,
    sharpeRatio: 1.68,
    maxDrawdown: 0.12,
    var95: 72500,
    expectedShortfall: 92000
  },
  sectorExposure: [
    {
      sector: '科技',
      percentage: 42,
      risk: '高'
    },
    {
      sector: '金融',
      percentage: 18,
      risk: '中等'
    },
    {
      sector: '医疗',
      percentage: 15,
      risk: '中等'
    },
    {
      sector: '消费',
      percentage: 12,
      risk: '低'
    },
    {
      sector: '能源',
      percentage: 8,
      risk: '高'
    },
    {
      sector: '公用事业',
      percentage: 5,
      risk: '低'
    }
  ],
  riskMetrics: {
    var95: 72500,
    expectedShortfall: 92000,
    stressTestResults: {
      '2008金融危机': -18.5,
      '新冠疫情': -21.3,
      '利率上升': -9.7,
      '地缘政治冲突': -14.2,
      '通胀超预期': -12.8
    }
  },
  riskScoreHistory: [
    { date: '2023-10-01', score: 3.8 },
    { date: '2023-11-01', score: 3.7 },
    { date: '2023-12-01', score: 3.9 },
    { date: '2024-01-01', score: 4.0 },
    { date: '2024-02-01', score: 3.9 },
    { date: '2024-03-01', score: 4.1 },
    { date: '2024-04-01', score: 4.2 }
  ],
  recommendations: [
    '建议适当降低科技行业敞口，分散至其他行业',
    '可增加一些低相关性资产，如黄金或TIPS，以增强组合抗通胀能力',
    '考虑增加国际资产配置，分散国别风险',
    '短期内，可采取适当的对冲策略，降低市场波动带来的风险'
  ]
};

// 合规数据
export const mockComplianceData = {
  kycStatus: '已通过',
  lastReviewDate: '2024-03-01',
  riskLevel: '中等',
  alerts: [
    {
      id: 1,
      type: '大额交易',
      description: '单笔交易超过100万',
      date: '2024-03-20',
      status: '已处理'
    },
    {
      id: 2,
      type: '异常登录',
      description: '从新IP地址登录',
      date: '2024-03-19',
      status: '已确认'
    }
  ],
  documents: [
    {
      id: 1,
      name: '身份证明',
      type: '身份证',
      status: '已验证',
      expiryDate: '2025-12-31'
    },
    {
      id: 2,
      name: '地址证明',
      type: '水电费账单',
      status: '已验证',
      expiryDate: '2025-12-31'
    }
  ]
};

// 系统用户数据
export const mockSystemUsers = [
  {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    department: '系统管理部',
    lastLogin: '2024-03-20 10:30:00',
    status: '在线'
  },
  {
    id: 2,
    username: 'manager',
    name: '客户经理',
    role: 'manager',
    department: '客户服务部',
    lastLogin: '2024-03-20 09:15:00',
    status: '在线'
  },
  {
    id: 3,
    username: 'risk',
    name: '风控人员',
    role: 'risk',
    department: '风险控制部',
    lastLogin: '2024-03-20 08:45:00',
    status: '离线'
  },
  {
    id: 4,
    username: 'compliance',
    name: '合规人员',
    role: 'compliance',
    department: '合规管理部',
    lastLogin: '2024-03-20 08:30:00',
    status: '在线'
  }
];

// 系统设置数据
export const mockSystemSettings = {
  general: {
    systemName: '私人财富管理系统',
    version: '1.0.0',
    maintenanceMode: false,
    lastBackup: '2024-03-20 00:00:00'
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5
  },
  notifications: {
    email: true,
    sms: false,
    push: true
  }
};

// Mock API 服务
export const mockApi = {
  // 认证相关
  auth: {
    login: (username, password) => {
      console.log('Mock API: 登录请求', username, password);
      
      // 简化的登录逻辑 - 总是成功，返回与用户名匹配的角色
      let role = 'client';
      
      // 根据用户名判断角色
      if (username.includes('admin')) {
        role = 'admin';
      } else if (username.includes('manager')) {
        role = 'manager';
      } else if (username.includes('risk')) {
        role = 'risk';
      } else if (username.includes('compliance')) {
        role = 'compliance';
      }
      
      console.log('Mock API: 登录成功，角色:', role);
      
      // 始终返回成功结果
      return Promise.resolve({
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          username: username,
          name: `${role}用户`,
          role: role,
          token: `mock-token-${Date.now()}`,
          lastLogin: new Date().toISOString()
        }
      });
    },
    logout: () => Promise.resolve({ success: true })
  },

  // 客户相关
  client: {
    getProfile: (clientId) => Promise.resolve(mockClients.find(c => c.id === clientId)),
    getPortfolio: (clientId) => Promise.resolve(mockPortfolios.find(p => p.clientId === clientId)),
    getTransactions: (clientId) => Promise.resolve(mockTransactions.filter(t => t.clientId === clientId)),
    updateProfile: (clientId, data) => Promise.resolve({ success: true, data })
  },

  // 投资组合相关
  portfolio: {
    getPortfolioDetails: (portfolioId) => Promise.resolve(mockPortfolios.find(p => p.id === portfolioId)),
    getHoldings: (portfolioId) => Promise.resolve(mockPortfolios.find(p => p.id === portfolioId)?.holdings || []),
    getPerformance: (portfolioId) => Promise.resolve({
      daily: 0.31,
      weekly: 1.2,
      monthly: 3.5,
      yearly: 12.8
    })
  },

  // 市场相关
  market: {
    getMarketData: () => Promise.resolve(mockMarketData),
    getStockQuote: (symbol) => Promise.resolve({
      symbol,
      price: 100,
      change: 1.5,
      changePercent: 1.5
    })
  },

  // 风险相关
  risk: {
    getRiskAnalysis: (portfolioId) => Promise.resolve(mockRiskData),
    getRiskMetrics: (portfolioId) => Promise.resolve(mockRiskData.riskMetrics),
    getSectorExposure: (portfolioId) => Promise.resolve(mockRiskData.sectorExposure)
  },

  // 合规相关
  compliance: {
    getComplianceStatus: (clientId) => Promise.resolve(mockComplianceData),
    getAlerts: (clientId) => Promise.resolve(mockComplianceData.alerts),
    getDocuments: (clientId) => Promise.resolve(mockComplianceData.documents)
  },

  // 系统管理相关
  admin: {
    getSystemUsers: () => Promise.resolve(mockSystemUsers),
    getSystemSettings: () => Promise.resolve(mockSystemSettings),
    updateSystemSettings: (settings) => Promise.resolve({ success: true, data: settings })
  },

  // 交易相关
  trade: {
    getTransactions: (clientId) => Promise.resolve(mockTransactions.filter(t => t.clientId === clientId)),
    executeTrade: (tradeData) => Promise.resolve({
      success: true,
      data: {
        id: mockTransactions.length + 1,
        ...tradeData,
        date: new Date().toISOString(),
        status: '已完成'
      }
    }),
    getTradeHistory: (clientId) => Promise.resolve(mockTransactions.filter(t => t.clientId === clientId))
  }
}; 