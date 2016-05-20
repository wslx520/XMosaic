## XMosaic.js,javascript版马赛克遮罩图片切换效果

用来实现：将图片横竖划分成指定的几十个小块（马赛克），按指定顺序，执行指定的变换效果，并完成图片切换。

来自[脚儿网](http://jo2.org/javascript%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9%E5%9B%BE%E7%89%87%E5%88%87%E6%8D%A2%E6%95%88%E6%9E%9Cxmosaic-js/)

[在线预览](http://jo2.org/htmls/xmosaic/msk.htm)（可实时切换参数查看效果）

### 使用方法：

**html代码**：
    <div id="jsF">
    <a href="#" title=""><img src="images/s1.jpg" alt="" /></a>
    <a href="#" title=""><img src="images/s2.jpg" alt="" /></a>
    <a href="#" title=""><img src="images/s3.jpg" alt="" /></a>
    <a href="#" title=""><img src="images/s4.jpg" alt="" /></a>
    </div>
    <ul id="pager">
        <li class="on">1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>
即一个图片容器，一个页码

**JS代码**：
    var msk = XMosaic('jsF',{pager:'pager',delay:3000,countX:10,countY:5,how:2,order:4 });

### 参数说明：

**how**：
指定切换效果,针对*每一个分块*
0,依次淡入
1,依次左至右滚动并淡入
2,依次上至下滚动并淡入
3,依次右至左滚动并淡入
4,依次下至上滚动并淡入
5,依次右至左交错滚动并淡入
6,依次上至下交错滚动并淡入
7,依次宽度由0加至100%并淡入
8,依次高度由0加至100%并淡入
9,宽高同时由0加至100%并淡入

**count**X:
横向分块个数，默认5
**countY**:
纵向分块个数，默认1
**order**:
动画执行顺序，共6种，默认0
0,从第一个执行到最后一个
1,从最后一个执行到第一个
2,从中间执行到两头
3,从两头执行到中间
4,随机
5,同时执行
**delay**:
切换间隔时间，默认4000
**pager**:
页码块的id
**event**:
触发页码切换的事件，默认mouseover，可以设为click等