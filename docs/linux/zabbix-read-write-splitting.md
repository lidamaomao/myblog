---
title: Zabbix 读写分离配置
date: 2021-04-10
categories:
  - Linux
tags:
  - Zabbix
  - PHP
---

因为 Zabbix 所有的数据库操作方法，都写在 `/include/db.inc.php` 文件中，所以主要修改也都集中在这个文件里。

通过观察日志发现，所有的 SQL 语句都会通过 `DBselect` `DBexecute` 两个函数来执行。`DBexecute` 会执行增删改查所有类型的操作。`DBselect` 执行的都是查询类操作，所以主要修改 `DBselect` 函数。

`DBselect` 既能执行事务类 SQL ，又能执行非事务类 SQL 。事务内的 SQL 语句不管读写肯定是要保持在同一个数据库上操作，所以需要在 `DBselect` 函数来判断该函数执行的是 事务类 SQL，还是非事务类 SQL。

在修改 `DBselect` 函数前，首先要创建一个到从库的连接，Zabbix 每个接口调用时，都会同过 `DBconnect` 创建一个接口内公用的数据库连接，所以我们也在 `DBconnect` 中创建一个通往从库的数据库连接。

```php
function DBconnect(&$error)
{
    global $DB, $DBR; //在这里声明一个全局变量 DBR ，用来存储自己创建的从库连接。

    ...

    $DB['DB'] = $db->connect($DB['SERVER'], $DB['PORT'], $DB['USER'], $DB['PASSWORD'], $DB['DATABASE'], $DB['SCHEMA']); // Zabbix 默认的数据库连接

	// 我们自己创建的连接，写在 Zabbix 默认的连接之后
    // 处理DBR开始
    $db2 = new MysqlDbBackend();
    if ($DB['ENCRYPTION']) {
        $db2->setConnectionSecurity(
            $DB['KEY_FILE'],
            $DB['CERT_FILE'],
            $DB['CA_FILE'],
            $DB['VERIFY_HOST'],
            $DB['CIPHER_LIST']
        );
    }
    $DBR = $db2->connect($DB['SERVER'], '6447', $DB['USER'], $DB['PASSWORD'], $DB['DATABASE'], $DB['SCHEMA']); // 这里的从库端口没有通过配置文件获取，直接写死在了连接里，所以没有去修改 CConfigFile 来新增配置项。
    $db2->init();
    // 处理DBR结束
	// DBR 一定要写在默认的 $db->init() 之前，因为 $db->init() 方法中会使用到 DBselect 函数, 如果写在这句之后，那么等他调用 DBselect 时，我们的 DBR 还没创建好，就会报错。
    if ($DB['DB']) {
        $db->init();
    }

    ...

}
```

现在，我们到从库的连接已经创建好了，接下来修改 `DBselect` 函数。 判断 `DBselect` 是否在事务中，可以利用 `DB['TRANSACTIONS']` 的值，在 `DBconnect` 数据库创建连接 和 `DBend` 事务结束 时 该项的值都被定义为了 0 ，只有在 `DBstart` 事务开始时，该项的值执行了 ++ 操作，所以我们判断当值为 0 时，执行的语句并不在事务中。

```php
function DBselect($query, $limit = null, $offset = 0)
{
    global $DB, $DBR; // 同样，声明全局变量

    // 判断 DBselect 是否在事务中。如过不在事务中，则通过 DBR 来执行 SQL 语句
    if ($DB['TRANSACTIONS'] == 0) {
        $result = false;

        if (!$query = DBaddLimit($query, $limit, $offset)) {
            return false;
        }

        if (!$DBR) {
            return false;
        }

        if (!$result = mysqli_query($DBR, $query)) {
            error('Error in query [' . $query . '] [' . mysqli_error($DBR) . ']', 'sql');
        }

        return $result;
    }

    ...

}
```
