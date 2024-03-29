module.exports = [
    {
        title: 'Linux & Mac',
        collapsable: false,
        children: [
            'linux/kafka_cli',
            'linux/shell',
        ]
    },
    {
        title: 'Ruby On Rails',
        collapsable: false,
        children: [
            '',
            'rails/includes_where',
            'ruby/before_action',
            'rails/doorkeeper',
            'ruby/rest_client',
            'rails/searchkick',
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
            'mysql/metadata_lock',
            'mysql/lock',
            'mysql/dead_lock',
            'mysql/in_and_exists',
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
            'alogrithm/interesting',
        ]
    },
    {
        title: '遇到问题及解决方案',
        collapsable: false,
        children: [
            'problems/mysql_es',
            'problems/mysql_connection',
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
        title: '设计模式',
        collapsable: false,
        children: [
            'design_pattern/facade',
            'design_pattern/adapter',
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
        title: 'OS',
        collapsable: false,
        children: [
            'os/process_thread',
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
    }
];
