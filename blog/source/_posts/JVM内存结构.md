---
title: JVM内存结构
date: 2026-02-26 15:15:37
tags: [JVM]    # 标签
cover: /img/6.jpg
---



JVM学习路线：

![image-20260226151537964](image-20260226151537964.png)

视频：[04_学习路线_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1yE411Z7AP?spm_id_from=333.788.videopod.episodes&vd_source=499c257f0104fdb6ce035bd58aedbdf9&p=4)



*1.程序计数器*

下面是 JVM 指令与对应 Java 代码的一个示例：



   ```
     二进制字节码                             Java源码
   
   0: getstatic     #20                        // PrintStream out = System.out; 
   3: astore_1                                 // -- 
   4: aload_1                                  // out.println(1); 
   5: iconst_1                                 // -- 
   6: invokevirtual #26                        // -- 
   9: aload_1                                  // out.println(2); 
   10: iconst_2                                // -- 
   11: invokevirtual #26                       // -- 
   14: aload_1                                 // out.println(3); 
   15: iconst_3                                // -- 
   16: invokevirtual #26                       // -- 
   19: aload_1                                 // out.println(4); 
   20: iconst_4                                // -- 
   21: invokevirtual #26                       // -- 
   24: aload_1                                 // out.println(5); 
   25: iconst_5                                // -- 
   26: invokevirtual #26                       // -- 
   29: return
   ```





Java 源代码经过编译后得到二进制字节码，字节码中包含许多的 JVM 指令。

CPU 并不能直接执行 JVM 指令，在这中间还需要一个「解释器」。「解释器」将 JVM 指令解释为机器码，之后再由 CPU 执行这些机器码。

上述示例的 JVM 指令前都有一个数字，它们是 JVM 指令的执行地址。

当前一条指令执行完成后，解释器会去「程序计数器」中取得下一条 JVM 指令的执行地址，然后再执行。

Java 程序支持多线程运行。当系统中有多个线程正在运行时，CPU 会为每个线程分配时间片。如果一个线程中的逻辑在一个时间片内未执行完，CPU 会将该线程的状态进行暂存，然后切换到另一个线程并执行它的逻辑，后续又轮到第一个线程执行时，能够继续执行 剩余 逻辑。

由于「程序计数器」是线程私有的，线程在时间片轮转的过程中能够轻松得知下一条指令的执行地址，完成剩余逻辑的执行。




**作用**：记录当前线程正在执行的 JVM 指令地址

**特点**：线程私有，每个线程都有独立的程序计数器，互不干扰。









2.虚拟机栈

每个线程运行时所需要的内存，称为「虚拟机栈」，由于物理内存的大小是一定的，当虚拟机栈的大小越大时， 可供使用的线程数就会越少。
每个栈由多个「栈帧」（Frame）组成，对应着每次方法调用时所占用的内存，栈帧包括参数，局部变量，返回地址等等
每个线程只能有一个活动栈帧（也就是栈顶的栈帧），对应着当前正在执行的那个方法





**特点**：

- 线程私有，生命周期与线程一致。

- 栈深度有限，超出时抛出 `StackOverflowError`（如递归调用无终止条件）；栈扩展失败时抛出 `OutOfMemoryError`。

  



垃圾回收不涉及栈内存

栈内存可以通过 -Xss 虚拟机参数来指定

（指定为1m：-Xss1m
			 -Xss1024k
			 -Xss1048576）



问：方法内的局部变量是否是线程安全的？

如果方法内局部变量没有逃离方法的作用范围，它是线程安全的
如果局部变量引用了对象，并逃离方法的作用范围，就需要考虑线程安全问题

eg：

```
  二进制字节码                             Java源码

0: getstatic     #20                        // PrintStream out = System.out; 
3: astore_1                                 // -- 
4: aload_1                                  // out.println(1); 
5: iconst_1                                 // -- 
6: invokevirtual #26                        // -- 
9: aload_1                                  // out.println(2); 
10: iconst_2                                // -- 
11: invokevirtual #26                       // -- 
14: aload_1                                 // out.println(3); 
15: iconst_3                                // -- 
16: invokevirtual #26                       // -- 
19: aload_1                                 // out.println(4); 
20: iconst_4                                // -- 
21: invokevirtual #26                       // -- 
24: aload_1                                 // out.println(5); 
25: iconst_5                                // -- 
26: invokevirtual #26                       // -- 
29: return
```



m1() 方法中的 sb 对象是线程安全的；
m2() 方法中的 sb 对象并不是线程安全的，因为 sb 是通过参数传入的，它可能会被其他线程使用
m3() 方法中的 sb 对象也不是线程安全的，它通过方法返回值返回出去后，可以被多个线程使用



栈内存溢出：

什么情况下会导致栈内存溢出（java.lang.StackOverflowError）？

​        栈帧过多
​	栈帧过大

绝大多数栈内存溢出都是由于栈帧过多导致









3.本地方法栈

**作用**：为 JVM 执行**本地方法**（如 JNI 调用的 C/C++ 方法）提供内存空间。

**特点**：

- 线程私有，与虚拟机栈逻辑类似，但针对本地方法。
- 同样会抛出 `StackOverflowError` 和 `OutOfMemoryError`。







4.堆

通过 new 关键字创建的对象都会使用堆内存。



特点：

线程共享，所有线程都可访问堆中的对象。

可通过 `-Xms`（初始堆大小）和 `-Xmx`（最大堆大小）配置，如 `-Xms512m -Xmx1024m`。

堆内存不足时抛出 `OutOfMemoryError: Java heap space`。



**细分（分代回收）**：

- 新生代（Young Generation）：存储新创建的对象，分为 Eden 区、Survivor From 区、Survivor To 区（比例默认 8:1:1）。
- 老年代（Old Generation）：存储存活时间长的对象（新生代多次 GC 后仍存活的对象）。
- 元空间（Metaspace）：JDK 8 后替代永久代，属于堆外内存，存储方法区数据。







5.方法区

**作用**：存储类信息（类名、访问修饰符、字段、方法）、常量池、静态变量、即时编译器编译后的代码等。

**JDK 版本差异**：

- JDK 7 及之前：方法区又称 “永久代”（PermGen），**属于堆的一部分**，可通过 `-XX:PermSize` 和 `-XX:MaxPermSize` 配置，溢出时抛出 `OutOfMemoryError: PermGen space`。
- JDK 8 及之后：移除永久代，改用**元空间（Metaspace）**，元空间使用**本地内存**（直接内存），默认无上限（可通过 `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 限制），溢出时抛出 `OutOfMemoryError: Metaspace`。

**特点**：

- 线程共享，全局唯一。
- 常量池是方法区的核心部分，存放字面量（如字符串）和符号引用，JDK 7 后常量池移至堆中。



![image-20260226163732460](image-20260226163732460.png)



常量池：就是一张表，虚拟机指令根据这张常量表找到要执行的类名、方法名、参数类型、字面量等信息
运行时常量池：常量池存在于 *.class 文件中，当该类被加载，它的常量池信息就会被放入运行时常量池，并把里面的符号地址变为真实地址****



eg：

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}



要运行上述代码，需要将其编译成二进制字节码，它主要包括：

类的基本信息
常量池
类的方法定义（包含虚拟机指令）



使用 javap -v HelloWorld.class 反编译字节码：

```
// ------------- 以下是「类的基本信息」-------------
Classfile /D:/Code/Java/MyCode/jvm-demo/structure/target/classes/indi/mofan/HelloWorld.class
  Last modified 2025-5-3; size 555 bytes
  MD5 checksum ac4ed814f06117795da5bc9fe3c3c0ef
  Compiled from "HelloWorld.java"
public class indi.mofan.HelloWorld
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
// ------------- 以上是「类的基本信息」-------------

// ------------- 以下是「常量池」-------------
Constant pool:
   #1 = Methodref          #6.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #21.#22        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #23            // Hello World
   #4 = Methodref          #24.#25        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #26            // indi/mofan/HelloWorld
   #6 = Class              #27            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lindi/mofan/HelloWorld;
  #14 = Utf8               main
  #15 = Utf8               ([Ljava/lang/String;)V
  #16 = Utf8               args
  #17 = Utf8               [Ljava/lang/String;
  #18 = Utf8               SourceFile
  #19 = Utf8               HelloWorld.java
  #20 = NameAndType        #7:#8          // "<init>":()V
  #21 = Class              #28            // java/lang/System
  #22 = NameAndType        #29:#30        // out:Ljava/io/PrintStream;
  #23 = Utf8               Hello World
  #24 = Class              #31            // java/io/PrintStream
  #25 = NameAndType        #32:#33        // println:(Ljava/lang/String;)V
  #26 = Utf8               indi/mofan/HelloWorld
  #27 = Utf8               java/lang/Object
  #28 = Utf8               java/lang/System
  #29 = Utf8               out
  #30 = Utf8               Ljava/io/PrintStream;
  #31 = Utf8               java/io/PrintStream
  #32 = Utf8               println
  #33 = Utf8               (Ljava/lang/String;)V
// ------------- 以上是「常量池」-------------

// ------------- 以下是「类的方法定义」------------- 
{
  public indi.mofan.HelloWorld();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 8: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lindi/mofan/HelloWorld;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String Hello World
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 10: 0
        line 11: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  args   [Ljava/lang/String;
}
// ------------- 以上是「类的方法定义」-------------

SourceFile: "HelloWorld.java"
```







每条虚拟机指令都会对应常量池表中一个地址（比如 getstatic #2 中的 #2 就是常量池中的一个地址），常量池表中的地址可能对应着一个类名、方法名、参数类型等信息。







6.StringTable（字符串常量池）

StringTable（字符串常量池 / 字符串池）是 JVM 为**字符串**专门设计的一块内存区域，本质是一个**哈希表（HashTable）**，用于存储字符串常量的引用，目的是避免字符串重复创建，节省内存并提升性能（字符串复用）



字符串变量拼接的原理是使用 StringBuilder（JDK 1.8）
字符串常量拼接会被编译器优化
可以使用 String.intern() 方法主动向 StringTable 中放入不存在的字符串对象



eg：

```
public class Demo_3_1 {
    public static void main(String[] args) {
        String s1 = "a";
        String s2 = "b";
        String s3 = "ab";
    }
}
```





编译上述代码后，使用 javap -v 反编译：

```
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=4, args_size=1
         0: ldc           #2                  // String a
         2: astore_1
         3: ldc           #3                  // String b
         5: astore_2
         6: ldc           #4                  // String ab
         8: astore_3
         9: return


```



StringTable 是一个 Hashtable 结构，并且不能扩容，程序刚运行时，StringTable 内没有任何元素。

在加载 Demo 时，其常量池中的信息会被加载到「运行时常量池」中，这时 a、b 和 ab 都是常量池中的符号，不是 Java 字符串对象。

当执行到 ldc #2 时，会把符号 a 变为 "a" 字符串对象，b 和 ab 也是如此（字符串延迟加载）。

转化后如果常量池没有就入池



![image-20260226194032390](image-20260226194032390.png)



位置:

![image-20260226193707446](image-20260226193707446.png)



StringTable 的垃圾回收:

在堆内存空间不足时，会触发 StringTable 的垃圾回收。



性能调优：

1.使用 -XX:StringTableSize 参数

桶的个数大一点时间短一点

2.当系统中存在大量、可重复的字符串时，可以考虑调用 String.intern() 方法将字符串添加到 StringTable 中，以减少堆内存的使用。







7.直接内存：

直接内存（Direct Memory）也叫**堆外内存**，是一块分配在 JVM 堆之外、直接向操作系统申请的内存区域，不受 JVM 堆内存管理，但受物理机总内存限制。是操作系统和 Java 代码都可以直接访问的一块区域



特点：

| 特性              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| 不受堆大小限制    | `-Xmx` 仅限制堆内存，直接内存大小由 `-XX:MaxDirectMemorySize` 控制（默认等于堆最大内存） |
| 读写性能更高      | 传统堆内存 IO：JVM 堆 ↔ 操作系统内核缓冲区 ↔ 磁盘 / 网络；直接内存 IO：直接内存 ↔ 磁盘 / 网络（减少一次数据拷贝），适合高频 IO 场景。 |
| 手动管理风险      | 直接内存的分配 / 释放不由 JVM GC 自动处理，若忘记释放会导致**内存泄漏**，最终触发 `OutOfMemoryError: Direct buffer memory`。 |
| 分配 / 释放成本高 | 向操作系统申请 / 释放内存的开销比堆内存大（需系统调用），适合「一次分配、多次使用」的场景，不适合频繁创建 / 销毁。 |



底层原理：通过 Unsafe 类的 `allocateMemory(long size)` 方法向操作系统申请内存



回收方式：

##### 方式 1：自动回收

- `DirectByteBuffer` 内部关联了一个 `Cleaner`（虚引用），当 `DirectByteBuffer` 对象在堆中被 GC 回收时，`Cleaner` 会触发 `run()` 方法，调用 Unsafe 的 `freeMemory()` 释放直接内存；
- 缺点：回收时机不可控 ——Finalizer 线程优先级低，可能延迟释放，导致直接内存临时泄漏。

##### 方式 2：手动回收

- 主动调用 `Cleaner.clean()` 方法释放直接内存（如示例代码）；
- 底层调用 Unsafe 类的 `freeMemory()` 方法。
