// import React from 'react';
// import { Card, List, Avatar, Badge } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

// // 模拟用户信息
// const userInfo = {
//     name: '张三',
//     avatarUrl: 'https://dummyimage.com/100x100/007BFF/fff&text=Avatar',
//     jobTitle: '软件工程师',
//     department: '技术部'
// };

// // 模拟消息数据
// const messages = [
//     { id: 1, content: '这是一条重要的项目通知', isRead: false },
//     { id: 2, content: '你有一份新的任务分配', isRead: false },
//     { id: 3, content: '上周的工作总结请及时提交', isRead: true },
//     { id: 4, content: '团队聚餐的时间确定了', isRead: true }
// ];

// // 分离已读和未读消息
// const unreadMessages = messages.filter(msg =>!msg.isRead);
// const readMessages = messages.filter(msg => msg.isRead);

// const PersonIndex = () => {
//     return (
//         <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             {/* 用户信息卡片 */}
//             <Card
//                 style={{ width: 300, marginBottom: 20 }}
//                 cover={
//                     <img
//                         alt="example"
//                         src={userInfo.avatarUrl}
//                         style={{ height: 200, objectFit: 'cover' }}
//                     />
//                 }
//             >
//                 <Card.Meta
//                     avatar={<Avatar icon={<UserOutlined />} />}
//                     title={userInfo.name}
//                     description={`${userInfo.jobTitle} - ${userInfo.department}`}
//                 />
//             </Card>

//             {/* 消息列表部分 */}
//             <div style={{ width: '100%', maxWidth: 600 }}>
//                 {/* 未读消息列表 */}
//                 <List
//                     header={<h2>未读消息 <Badge count={unreadMessages.length} /></h2>}
//                     dataSource={unreadMessages}
//                     renderItem={(item) => (
//                         <List.Item>
//                             <List.Item.Meta
//                                 title={item.content}
//                             />
//                         </List.Item>
//                     )}
//                 />
//                 {/* 已读消息列表 */}
//                 <List
//                     header={<h2>已读消息</h2>}
//                     dataSource={readMessages}
//                     renderItem={(item) => (
//                         <List.Item>
//                             <List.Item.Meta
//                                 title={item.content}
//                             />
//                         </List.Item>
//                     )}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PersonIndex;
import React, { useContext } from'react';
import { Card, List, Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { UserContext } from '../../../context/store';




// 模拟用户信息
const userInfo = {
    name: '张三',
    avatarUrl: 'https://dummyimage.com/100x100/007BFF/fff&text=Avatar',
    jobTitle: '软件工程师',
    department: '技术部'
};

// 模拟消息数据
const messages = [
    { id: 1, content: '这是一条重要的项目通知', isRead: false },
    { id: 2, content: '你有一份新的任务分配', isRead: false },
    { id: 3, content: '上周的工作总结请及时提交', isRead: true },
    { id: 4, content: '团队聚餐的时间确定了', isRead: true }
];

// 分离已读和未读消息
const unreadMessages = messages.filter(msg =>!msg.isRead);
const readMessages = messages.filter(msg => msg.isRead);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
};

const PersonIndex = () => {
  const { user } = useContext(UserContext);
  console.log('user', user);
    return (
        <motion.div
            className="person-index-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex-container">
                {/* 用户信息卡片 */}
                <motion.div
                    variants={itemVariants}
                    className="user-info-card"
                >
                    <Card
                        cover={
                            <img
                                alt="example"
                                src={userInfo.avatarUrl}
                                style={{ height: 180, objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                            />
                        }
                    >
                        <Card.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={userInfo.name}
                            description={`${userInfo.jobTitle} - ${userInfo.department}`}
                        />
                    </Card>
                </motion.div>
                <div className="message-container">
                    {/* 未读消息列表 */}
                    <motion.div
                        variants={itemVariants}
                        className="message-list"
                    >
                        <List
                            header={<h2>未读消息 <Badge count={unreadMessages.length} /></h2>}
                            dataSource={unreadMessages}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </motion.div>
                    {/* 已读消息列表 */}
                    <motion.div
                        variants={itemVariants}
                        className="message-list"
                    >
                        <List
                            header={<h2>已读消息</h2>}
                            dataSource={readMessages}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default PersonIndex;
    