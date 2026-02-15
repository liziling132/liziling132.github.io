---
title: Java期末复习
date: 2025-12-10 15:06:00
tags: [Java, 期末复习]    # 标签
cover: /img/11.png



---

这份试卷涵盖了Java基础语法的核心重点，包括面向对象（OOP）、集合框架、多线程、异常处理以及IO/网络编程。

下面我将分三个部分为你详细解析：**第一部分是对简答/分析题（1-11题）的解析**，**第二部分是三道编程大题的参考代码**，**第三部分是针对这份真题总结的备考方向**。

------

### 第一部分：简答与程序分析题解析

#### 1. 参数传递（值传递 vs 引用传递）

**知识点：** Java中参数传递只有“值传递”。基本数据类型传递的是数值的拷贝，引用数据类型传递的是地址（引用）的拷贝。 **解析：**

- `modifyValue` 方法中：
  - `int val` 是基本类型，方法内修改 `val` 不会影响 `main` 方法中的 `count`。
  - `IntClass s` 是引用类型，方法内通过 `s.value = val` 修改了对象内部的属性，这会直接影响 `main` 方法中的对象 `a`。 **运行结果：**

Plaintext

```
0      // a 初始化后 value 默认为 0
100    // 方法调用修改了对象 a 的 value
100    // 基本类型 count 未被修改
```

#### 2. 抽象类 vs 接口

**知识点：** 面向对象抽象机制。 **解答：**

- **共同点：** 1. 都不能被实例化（不能 `new`）。 2. 都可以包含抽象方法（没有方法体的方法）。 3. 都是为了实现多态和代码复用。
- **不同点：**
  - **属性：** 接口中默认是 `public static final`（常量）；抽象类可以有普通成员变量。
  - **方法：** 接口（Java 8前）只能有抽象方法；抽象类可以有非抽象方法（具体实现）。
  - **实现策略（继承）：** 一个类只能继承（extends）一个抽象类（单继承）；但可以实现（implements）多个接口（多实现）。
  - **构造方法：** 抽象类有构造方法（供子类调用）；接口没有构造方法。

#### 3. ArrayList vs LinkedList

**知识点：** 集合框架底层数据结构。 **解答：**

- **选择：** 应该选择 **LinkedList**。
- **原因：**
  - **ArrayList** 底层是**动态数组**。在中间插入或删除元素时，需要移动后续所有元素，效率较低（O(N)）。适合随机查找（O(1)）。
  - **LinkedList** 底层是**双向链表**。插入和删除只需要修改前后节点的指针，效率很高（O(1)）。适合频繁增删。

#### 4. final 与 finally

**知识点：** 关键字辨析。 **解答：**

- **final 特点：**
  - 修饰**变量**：变为常量，值不可更改（引用不可变）。
  - 修饰**方法**：不能被子类重写（Override）。
  - 修饰**类**：不能被继承（如 `String` 类）。
- **finally 用途：** 用于异常处理（try-catch-finally），无论是否发生异常，`finally` 代码块中的代码（如关闭资源、释放锁）**一定会被执行**。

#### 5. 多线程定义与区别

**知识点：** 线程创建方式。 **解答：**

- **两种方法：**
  1. 继承 `Thread` 类，重写 `run()` 方法。
  2. 实现 `Runnable` 接口，实现 `run()` 方法。
- **区别：** 继承 `Thread` 导致类无法继承其他父类（Java单继承局限）；实现 `Runnable` 更灵活，且适合多个线程共享同一个资源对象。
- **场景判断：** 如果该线程类已经继承了某个父类，**必须使用实现 Runnable 接口** 的方式。

#### 6. 方法重载 (Overload) vs 重写 (Override)

**知识点：** 多态性。 **解答：**

- **程序分析：**

  - `public double getScore(Double score)`
  - `private float getScore(Double score)`
  - 这两者**不能**构成重载，且会**编译报错**。因为重载要求参数列表不同，而这里参数完全相同，仅返回值和修饰符不同，Java 编译器无法区分。
  - 第三个方法 `private double getScore(double score)` 与前两个构成重载（参数类型 `double` vs `Double` 不同）。

- **重载 vs 重写：**

  - **重载 (Overload)：** 同一个类中，方法名相同，参数列表不同。
  - **重写 (Override)：** 子类重新定义父类的方法，方法名、参数、返回值必须一致。

- **重写示例：**

  Java

  ```
  class Undergraduate extends Student {
      @Override
      public double getScore(Double score) {
          return score * 1.0; // 修改计算逻辑
      }
  }
  ```

#### 7. Map 接口 (HashMap vs TreeMap)

**知识点：** Map 集合特性。 **解答：**

- **Map 特点：** 存储键值对（Key-Value），Key 不可重复。
- **区别：**
  - **HashMap：** 基于哈希表，**无序**，允许 null 键和 null 值，查询效率高。
  - **TreeMap：** 基于红黑树，**有序**（按 Key 自然排序或自定义排序），不允许 null 键。

#### 8. String vs StringBuilder

**知识点：** 字符串不可变性。 **解答：**

- **运行结果：** 程序一输出 `a`；程序二输出 `ahello`。
- **区别：**
  - **String：** 是**不可变**对象。每次修改（如 `+`）都会产生新的 String 对象。程序一中 `s="a"` 是传值，方法内 `s` 指向了新对象，原对象不变。
  - **StringBuilder：** 是**可变**对象。修改时是在原对象上操作。程序二中传递的是引用，方法内 `append` 修改了原对象的内容。
- **适用场景：** String 适合少量字符串操作或常量；StringBuilder 适合频繁修改、拼接字符串（如循环中拼接）。

#### 9. 异常处理

**知识点：** Checked Exception（受检异常）。 **解答：**

- **错误：** `called()` 声明抛出 `SelfException`（继承自 `Exception`），属于受检异常。`main` 方法调用了它，但没有处理。

- **修改方案一（Try-Catch）：**

  Java

  ```
  try {
      called();
  } catch (SelfException e) {
      e.printStackTrace();
  }
  ```

- **修改方案二（Throws）：**

  Java

  ```
  public static void main(String[] args) throws SelfException {
      called();
  }
  ```

#### 10. super 与 构造方法

**知识点：** 继承中的构造函数调用链。 **解答：**

- **错误分析：** **有错误**。父类 `Pare` 定义了带参构造 `Pare(int i)`，编译器就不会再提供默认无参构造 `Pare()`。子类 `Construct` 的构造方法默认会隐式调用 `super()`，但父类中不存在无参构造，导致编译失败。

- **修改方案：** 在 `Construct` 构造方法第一行显式调用父类构造。

  Java

  ```
  Construct(int num) {
      super(num); // 显式调用父类构造
      i = num;
  }
  ```

- **如果修复后运行结果：** `10, 7` (子类 i 为 10，`getSuper` 返回父类的 i 为 7，前提是父类构造正确赋值了)。

#### 11. 线程安全

**知识点：** 同步（Synchronization）。 **解答：**

- **能否得到预期结果？** **不能**。

- **原因：** `addChar` 方法没有同步。当线程 1 和线程 2 同时进入方法：

  1. 可能同时读取到相同的 `size` 值。
  2. 同时赋值 `data[size] = c`（导致数据覆盖）。
  3. 同时执行 `size++`（导致 size 只加了 1 而不是 2）。 这也是典型的“竞态条件”（Race Condition）。

- **修改方案：** 给方法加上 `synchronized` 关键字。

  Java

  ```
  public synchronized void addChar(char c) { ... }
  ```

------

### 第二部分：编程题解答

#### 1. 复数类 Complex 与 ArrayList 排序

**核心点：** 类定义、集合排序、Comparator 接口。

Java

```
import java.util.*;

class Complex {
    private int real;
    private int imagin;

    // (2) 构造方法
    public Complex() {
        this.real = 0;
        this.imagin = 0;
    }

    public Complex(int r, int i) {
        this.real = r;
        this.imagin = i;
    }

    // (3) sub 方法
    public Complex sub(Complex a) {
        return new Complex(this.real - a.real, this.imagin - a.imagin);
    }

    // 为了方便打印，重写 toString
    @Override
    public String toString() {
        if (imagin >= 0) return real + "+" + imagin + "i";
        return real + "" + imagin + "i";
    }

    public int getReal() { return real; }
}

public class Main {
    public static void main(String[] args) {
        // (4) 测试减法
        Complex c1 = new Complex(2, 3);
        Complex c2 = new Complex(5, 8);
        Complex res = c1.sub(c2);
        System.out.println("减法结果: " + res); // 预期 -3-5i

        // (5) ArrayList 排序
        ArrayList<Complex> list = new ArrayList<>();
        list.add(new Complex(-2, 3));
        list.add(new Complex(3, -5));
        list.add(new Complex(1, 4));

        // 使用 Collections.sort 和 Comparator
        Collections.sort(list, new Comparator<Complex>() {
            @Override
            public int compare(Complex o1, Complex o2) {
                // 实部从大到小排序 (o2 - o1)
                return o2.getReal() - o1.getReal();
            }
        });

        System.out.println("排序后: " + list);
    }
}
```

#### 2. 接口 Solid 与 多态设计

**核心点：** 接口实现、多态、策略模式思想。

Java

```
// (1) 接口与类定义
interface Solid {
    public double calVol();
}

class Cube implements Solid {
    double side;
    public Cube(double side) { this.side = side; }
    public double calVol() { return side * side * side; }
}

class Cylinder implements Solid {
    double r, h;
    public Cylinder(double r, double h) { this.r = r; this.h = h; }
    public double calVol() { return 3.14 * r * r * h; }
}

class Test {
    public void printVol(Solid s) {
        System.out.println("体积: " + s.calVol());
    }
}

// (2) GraphCalcu 类定义 (支持扩展)
class GraphCalcu {
    Solid solid; // 使用接口作为成员变量，实现多态组合

    // 构造方法接收任何 Solid 的实现类
    public GraphCalcu(Solid solid) {
        this.solid = solid;
    }

    public double Calcu() {
        if (solid != null) {
            return solid.calVol();
        }
        return 0.0;
    }
}
```

#### 3. TCP 服务器编程

**核心点：** ServerSocket, Socket, 多线程, IO流。

Java

```
import java.io.*;
import java.net.*;

public class TCPServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8377)) {
            System.out.println("服务器启动，监听端口 8377...");
            int clientCount = 0;

            while (true) {
                Socket socket = serverSocket.accept(); // 等待客户端连接
                clientCount++;
                // (1) 为每个请求派发一个线程
                new Thread(new ClientHandler(socket, clientCount)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class ClientHandler implements Runnable {
    private Socket socket;
    private int clientId;

    public ClientHandler(Socket socket, int clientId) {
        this.socket = socket;
        this.clientId = clientId;
    }

    @Override
    public void run() {
        try {
            InputStreamReader isr = new InputStreamReader(socket.getInputStream());
            BufferedReader in = new BufferedReader(isr);
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            String msg;
            while ((msg = in.readLine()) != null) {
                if (msg.equals("Bye")) {
                    break;
                }

                out.println("Client" + clientId + ", " + msg);

                // 【修改点2】把开文件和写文件的动作都放在锁里面
                synchronized (TCPServer.class) {
                    // 只有轮到我写的时候，我才打开文件
                    PrintWriter file = new PrintWriter(new FileWriter("D:\\chat.txt", true), true);
                    file.println("收到 Client" + clientId + ": " + msg);
                    file.close(); // 写完这一句，马上关闭！让出文件给别人用
                }
            }
            
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

------

### 第三部分：备考方向总结

通过这份真题，可以看出考试的侧重点非常清晰。建议你在接下来的复习中抓住以下几个核心模块：

1. **面向对象核心 (OOP) —— 重中之重**
   - **概念理解：** 必须彻底搞懂 **重载 vs 重写**、**抽象类 vs 接口**、**值传递**。这些是必考题。
   - **关键字：** `static`, `this`, `super`, `final` 的用法要烂熟于心。
   - **构造函数：** 特别是继承关系下的构造函数调用顺序（如第 10 题）。
2. **集合框架 (Collections)**
   - **API 使用：** 能够熟练使用 `ArrayList` 和 `HashMap` 进行增删改查。
   - **内部原理：** 知道 `LinkedList` 和 `ArrayList` 的区别，`HashMap` 和 `TreeMap` 的区别。
   - **排序：** 掌握 `Comparable` 和 `Comparator` 接口的写法（如编程题第 1 题）。
3. **多线程 (Multithreading)**
   - **实现方式：** 继承 `Thread` vs 实现 `Runnable`。
   - **线程安全：** 理解什么是竞态条件，以及如何使用 `synchronized` 解决（如第 11 题）。
4. **IO 流与网络编程**
   - **IO：** 掌握文件读写（`FileReader/Writer` 或 `BufferedReader/PrintWriter`）。
   - **Socket：** 能够默写出标准的 TCP Server/Client 结构（`ServerSocket` -> `accept` -> `socket` -> `InputStream/OutputStream`）。

**建议复习策略：** 先花时间把上面的**编程题代码**亲手敲一遍并运行通过，这能覆盖 60% 的知识点。然后针对**简答题**中的概念进行背诵和理解。祝你考试顺利！
