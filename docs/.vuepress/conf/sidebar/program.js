module.exports = [
    {
        title: 'Web相关',
        collapsable: false,
        children: [
            'web/xss_csrf',
            'web/cors',
            'web/https',
            'web/post',
            'web/session_and_cookie',
            'web/30x',
            'web/get_post',
            'web/gc',
            'web/oom',
        ]
    },
    {
        title: 'Ruby On Rails',
        collapsable: false,
        children: [
            '',
            'rails/includes_where',
            'rails/doorkeeper',
            'ruby/mutex',
            'ruby/gil',
            'ruby/utils',
        ]
    },
    {
        title: 'Redis',
        collapsable: false,
        children: [
            'redis/faq',
            'redis/cache',
            'redis/transaction_vs_pipeline',
            'redis/expire',
            'redis/cow',
            'redis/cluster',
            'redis/distributed_lock',
        ]
    },
    {
        title: 'Mysql',
        collapsable: false,
        children: [
            'mysql/faq',
            'mysql/b+',
            'mysql/transaction',
            'mysql/read',
            'mysql/buffer_pool',
            'mysql/log',
            'mysql/lock',
            'mysql/sql',
        ]
    },
    {
        title: 'RabbitMQ',
        collapsable: false,
        children: [
            'rabbitmq/faq',
            'rabbitmq/base',
            'rabbitmq/delay_queue',
        ]
    },
    {
        title: '算法',
        collapsable: false,
        children: [
            'alogrithm/graph_search',
            'alogrithm/binary_search',
            'alogrithm/dp',
            'alogrithm/tree_traversal',
            'alogrithm/dfs',
            'alogrithm/heap',
            'alogrithm/sort',
            'alogrithm/stack',
            'alogrithm/queue',
            'alogrithm/hash',
            'alogrithm/lru',
            'alogrithm/list',
            'alogrithm/prefix_sum',
            'alogrithm/seg_tree',
            'alogrithm/topological_sort',
            'alogrithm/expand',
            'alogrithm/two_pointers',
            'alogrithm/sliding_window',
            'alogrithm/bit',
        ]
    },
    {
        title: 'Nginx',
        collapsable: false,
        children: [
            'nginx/conf',
        ]
    },
    {
        title: '设计模式',
        collapsable: false,
        children: [
            'design_pattern/facade',
            'design_pattern/adapter',
        ]
    },
    {
        title: '遇到问题及解决方案',
        collapsable: false,
        children: [
            'problems/mysql_es',
        ]
    },
    {
        title: '支付宝',
        collapsable: false,
        children: [
            'alipay/alipay_global/'
        ]
    },
    {
        title: '微信',
        collapsable: false,
        children: [
            'wechat/oauth/'
        ]
    },
    {
        title: 'Git',
        collapsable: false,
        children: [
            'git/alias',
            'git/skill',
        ]
    },
    {
        title: 'Linux',
        collapsable: false,
        children: [
            'linux/shell',
        ]
    },
    {
        title: 'OS',
        collapsable: false,
        children: [
            'os/process_thread',
        ]
    }
];
