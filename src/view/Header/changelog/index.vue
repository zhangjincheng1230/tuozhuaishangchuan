<template>
  <div class="app-main">
    <div class="nav-menu" style="position: absolute;top:10px;right: 40px;z-index: 1">
      <div class="nav-menu-title">目录</div>
      <ul>
        <li>
          <a href="#V5.191125">V5.191125</a>
        </li>
        <li>
          <a href="#V5.191028">V5.191024</a>
        </li>
        <li>
          <a href="#V5.190827">V5.190827</a>
        </li>
        <li>
          <a href="#V5.190725">V5.190725</a>
        </li>
        <li>
          <a href="#V5.190626">V5.190626</a>
        </li>
        <li>
          <a href="#V5.190528">V5.190528</a>
        </li>
        <li>
          <a href="#V5.190427">V5.190427</a>
        </li>
        <li>
          <a href="#V5.190328">V5.190328</a>
        </li>
        <li>
          <a href="#V5.190226">V5.190226</a>
        </li>
        <li>
          <a href="#V5.190124">V5.190124</a>
        </li>
        <li>
          <a href="#V5.181227">V5.181227</a>
        </li>
        <li>
          <a href="#V5.181129">V5.181129</a>
        </li>
        <li>
          <a href="#V5.181101">V5.181101</a>
        </li>
        <li>
          <a href="#V5.180927">V5.180927</a>
        </li>
        <li>
          <a href="#V5.180912">V5.180912</a>
        </li>
        <li>
          <a href="#V5.180927">V5.180927</a>
        </li>
        <li>
          <a href="#V5.180905">V5.180905</a>
        </li>
        <li>
          <a href="#V5.180726">V5.180726</a>
        </li>
        <li>
          <a href="#V5.180627">V5.180627</a>
        </li>
        <li>
          <a href="#V5.180525">V5.180525</a>
        </li>
        <li>
          <a href="#V5.180417">V5.180417</a>
        </li>
        <li>
          <a href="#V5.180319">V5.180319</a>
        </li>
        <li>
          <a href="#V5.180123">V5.180123</a>
        </li>
      </ul>
    </div>
    <div class="kj-container" style="overflow: auto; padding-top: 10px;">
      <ul class="layui-timeline">
        <!--2019 11 25 begin-->
        <li class="layui-timeline-item">
          <a name="V5.191125"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.191125&nbsp;&nbsp;<span class="layui-badge-rim">2019-11-25</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5191125_1">票据工作台优化</h3>
                <ul>
                  <li>1、整体效率优化 <br/>
                  </li>
                  <li>2、票据详情信息列表增加“发票真伪”显示<br/>
                  </li>
                  <li>3、已生成的存货不支持在匹配时修改科目提示优化<br/>
                  </li>
                  <li>4、匹配存货显示格式优化<br/>
                  </li>
                  <li>
                    5、辅助核算处理<br/>
                    （1）机打发票的客户供应商辅助<br/>
                    （2）银行回单、火车票、飞机票等的部门辅助，根据票据上职员信息及职员辅助档案匹配对应部门<br/>
                  </li>
                  <li>
                    6、编辑分类会计科目可选非末级
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191125_2">销项发票/进项发票优化</h3>
                <ul>
                  <li>1．发票生成凭证的凭证日期可按票据实际日期生成<br/>
                  </li>
                  <li>2．进项导入认证状态处理<br/>
                  </li>
                  <li>3．新增“销售费用”业务类型<br/>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191125_3">库存模块优化</h3>
                <ul>
                  <li>
                    1、期末处理--成本结转（工业）-完工产品结转界面增加“导入”功能（需按“导出”按钮模版导入）<br/>
                  </li>
                  <li>
                    2、期末处理--成本结转（工业）-完工产品结转界面存货参照优化<br/>
                  </li>
                  <li>
                    3、期末处理--成本结转（工业）-存货暂估界面支持返回上一步（完工产品结转界面），方便用户调整产品结转数据<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5191125_4">账簿报表优化</h3>
                <ul>
                  <li>
                    1、发生额及余额表支持按年导出数据<br/>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191125_5">资产模块优化</h3>
                <ul>
                  <li>
                    1、资产卡片：资产编码长度增加到15位<br/>
                  </li>
                  <li>
                    2、资产卡片：折旧费用科目有辅助核算时支持辅助项录入<br/>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191125_6">其他易用优化</h3>
                <ul>
                  <li>
                    1、填制凭证：职员辅助录入--新增职员界面可维护所属部门
                  </li>
                  <li>
                    2、账簿报表：根据需要可选择是否显示打印日期
                  </li>
                  <li>
                    3、存货档案：隐藏掉税收编码等不常用字段
                  </li>
                  <li>
                    4、出入库单：调整字段宽度，优化存货展示
                  </li>
                  <li>
                    5、计提所得税算法优化
                  </li>
                  <li>
                    6、财报税局格式导出：新增湖南、广西、山西税局格式
                  </li>
                  <li>
                    7、附加税申报表适配税局最新调整（通用地区）
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 11 25 end-->
        <!--2019 10 28 begin-->
        <li class="layui-timeline-item">
          <a name="V5.191028"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.191024&nbsp;&nbsp;<span class="layui-badge-rim">2019-10-24</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5191028_1">票据工作台优化</h3>
                <ul>
                  <li>1、票据跨公司 <br/>
                    场景一：国税无法查验导致票据无法分发，可直接将票据跨公司至对应公司后进行入账<br/>
                    场景二：上传扫描时选择公司错误，作废重新上传太麻烦，可选择直接将票据跨公司<br/>
                    票据工作台节点，单选或多选票据右键点击【跨公司】可将票据跨至对应公司<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、匹配存货弹窗中显示存货的销售单价和销售数量<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3、农产品收购免税票税率处理<br/>
                    仅针对一般纳税人，收到带有“收购（左上角标识）”的增值税发票，税率、税额、金额按选择税率重新计算<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>4、辅助项未设置生成凭证校验处理<br/>
                    票据工作台智能做账若凭证辅助项为空，凭证预览列表显示“待确认”标识，补充缺失辅助项后可保存<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191028_2">销项发票/进项发票优化</h3>
                <ul>
                  <li>1．航信百旺销项XML文件导入取消文件名称格式校验<br/>
                  </li>
                  <li>2．进项发票一键取票多行明细时剔除第一行详见销货清单<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3．进项发票、销项发票导入清单格式处理，过滤单元格公式等特殊格式<br/>
                  </li>
                  <li>4．辅助项未设置生成凭证校验处理<br/>
                    进项发票/销项发票/银行对账单生成凭证，若辅助项为空，生成暂存凭证，修改补充缺失辅助项后可保存<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>5．进项发票和销项发票导入数据专普票判断逻辑优化<br/>
                  </li>
                  <li>6．增加“制造费用”业务类型，用户可在进项发票节点选择对应发票数据修改其业务类型为“制造费用”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image007.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5191028_3">库存模块优化</h3>
                <ul>
                  <li>
                    1、库存档案新增“生成结算价”功能：选择按“结存单价”或“销售平均单价的百分比”生成存货结算价。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image009.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image010.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、出入库单优化：<br/>
                    （1）出库领料单增加“显示结存数量”功能。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image011.png')]"
                      lazy>
                    </el-image>
                    （2）出入库列表增加“显示供应商或客户”功能。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image012.png')]"
                      lazy>
                    </el-image>
                    （3）打印选项：可根据需要，选择是否打印凭证号。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、新增“库存汇总表”：按存货汇总查询期间的数据，点击“存货编码”可联查库存明细账，查看存货明细数据。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5191028_4">期末处理优化</h3>
                <ul>
                  <li>
                    1、新增“批量打印”功能<br/>
                    （1）打印设置：设置打印公司、报表、期间数据，系统根据设置的公司生成一条定时任务，当天设置的任务，转天可进行打印或下载操作。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image015.png')]"
                      lazy>
                    </el-image>
                    （2）批量下载：当任务状态为“已生成”时，可执行多家公司批量下载操作，下载后的文件为PDF格式，用户打开PDF文件进行打印。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image016.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、暂估优化：<br/>
                    （1）实际业务中有些存货无法开票不能核算到成本中，系统允许存货暂估时“暂估数量不为0暂估金额为0”操作<br/>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image017.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20191028/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image018.png')]"
                      lazy>
                    </el-image>
                    （2）暂估回冲单优化：根据上期暂估单生成（删除金额=0的存货行）
                    <el-image
                      :src="require('@/assets/changelog/20191028/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20191028/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5191028_5">其他易用优化</h3>
                <ul>
                  <li>
                    1、会计科目：控制“400101基本生产成本”下三级科目不能自定义下级<br/>
                    2、收入预警：取数科目调整为“主营业务收入+其他业务收入”，历史数据系统自动升级<br/>
                    3、纳税申报：新增贵州地区企业所得税纳税申报表适配。<br/>
                    4、税收测算：增加导出功能。<br/>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 10 28 end-->

        <!--2019 9 24 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190924"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190924&nbsp;&nbsp;<span class="layui-badge-rim">2019-09-24</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190924_1">票据管理优化</h3>
                <ul>
                  <li>1、水路运输客票<br/>
                    基于税局“国家税务总局公告2019年第15号”文件，4月1日起纳税人购进国内旅客运输服务，其进项税额允许从销项税额中抵扣）<br/>
                    （1）票据信息<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image001.png')]"
                      lazy>
                    </el-image>
                    （2）入账<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image002.png')]"
                      lazy>
                    </el-image>
                    （3）税表取数<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、一般纳税人购进农产品免税票账务及税表取数中，均按9%税率作进项抵扣处理<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3、编辑分类中结算方式、合并方式及辅助核算增加注释说明<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>4、支持按票据类型、收付款方等维度进行票据查询及定位<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image006.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>5、增加快捷键说明<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>6、手续费票据处理<br/>
                    转出+手续费<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image009.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image010.png')]"
                      lazy>
                    </el-image>
                    转入+手续费<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image011.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image012.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>7、通行费发票处理<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image013.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190924_2">销项发票/进项发票优化</h3>
                <ul>
                  <li>1、匹配存货的存货参选弹窗中显示存货的结存单价<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image015.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、新增数据过滤空格<br/>
                    （1）存货名称 <br/>
                    （2）对方单位名称 <br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image016.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3、总账核算存货的不核算明细模式不校验是否开启存货辅助及数量核算<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>4、本方信息录入后保留可后续使用<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image018.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>5、认证平台导出新模板处理<br/>
                    认证平台导出进项数据中若无“认证状态”及“认证日期”字段，按税款所属期所在期间的最后一天生成认证日期<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image019.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image020.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>6、新增/修改界面税率下拉可选<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>7、新增、修改弹窗中对方单位相关信息可输入可参选<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190924_3">财务账簿优化</h3>
                <ul>
                  <li>
                    1、现金流量表：当现金流量表不平时，在提示界面可直接联查现金流分析有误凭证：<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image023.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、现金流量表联查明细优化：<br/>
                    （1）项目行联查明细触发点统一放在“金额”上，与其他账表账簿风格统一<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image025.png')]"
                      lazy>
                    </el-image>
                    （2）当无焦点时，点击“联查明细”按钮，默认展示当月全部现金流分析明细，且现金流明细界面增加【项目】列，方便用户导出查看<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190924_4">期末处理优化</h3>
                <ul>
                  <li>
                    1、计提所得税优化：增加小微企业判断条件<br/>
                    国家规定享受小型微利企业优惠需满足下述判断条件：<br/>
                    （1）不是从事国家限制或禁止的行业<br/>
                    （2）从业人数<=300人<br/>
                    （说明：上述（1、2）两个条件需用户自行控制，如不满足时需去掉企业信息中的“是否小型微利企业”勾选标识，系统不自动控制）<br/>
                    （3）资产总额<=5000万元<br/>
                    （4）企业年度应纳税所得额<=300万元<br/>
                    （说明：上述（3、4）两个条件在计提所得税时系统会自动判断）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、存货暂估算法优化：本版新增取当期负数采购数据的平均单价算法<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image028.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、成本结转优化（总账库存）：某些存货当期无销售，但由于暂估价或高或低导致的数量余额为0成本余额不为0时，将成本金额全部结转进销售成本（仅限启用总账存货应用场景，启用库存模块场景仍使用成本调整单由用户进行自主调整）。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image029.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、工业成本结转优化（启用库存管理模块）：产成品结转界面<br/>
                    （1）增加“存货编码”列，方便用户准确定位存货；<br/>
                    （2）增加“待分配金额”行，方便用户知道料工费还有哪些未分摊；<br/>
                    （3）增加“导出”功能，方便查看成本分摊情况及导出打印作凭证附件<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image030.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image030.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190924_5">工资表优化</h3>
                <ul>
                  <li>
                    工资表新增联查凭证功能<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190924/image031.png')"
                      :preview-src-list="[require('@/assets/changelog//20190924/image031.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190924_6">纳税申报优化</h3>
                <ul>
                  <li>
                    1、财报导出税局格式：新增山西、江西、陕西、新疆、黑龙江、青海、宁波、大连等8个地区。<br/>
                  </li>
                  <li>
                    2、纳税申报表适配税局格式：新增山西、内蒙古、江西、陕西、新疆、四川、黑龙江、青海、宁波、大连等10个地区；适配的税种为“企业所得税”；增值税和附加税使用通用格式。<br/>
                  </li>
                  <li>
                    3、根据北京、江苏地区税局最新格式调整附加税和文化事业建设税申报表<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190924_7">其他易用优化</h3>
                <ul>
                  <li>
                    1、加盟商合同到期删除凭证增加提醒
                  </li>
                  <li>
                    2、账表导出文件名优化：导出生成的文件名优化（按账表查询日期生成），方便查看和文件存档。
                  </li>
                  <li>
                    3、总账库存优化：“存货设置”节点，【默认设置】默认存货成本核算为“辅助明细”方式；出入库单打印增加【存货编码】列
                  </li>
                  <li>
                    4、“资产”--“资产卡片”节点：原“录入日期”---》调整为“入账日期”；原“录入前已入账”---》调整为“录入前已生成凭证”
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 9 24 end-->

        <!--2019 8 27 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190827"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190827&nbsp;&nbsp;<span class="layui-badge-rim">2019-08-27</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190827_1">票据管理优化</h3>
                <ul>
                  <li>1.【票据工作台】1002银行存款若无下级科目，智能做账不对银行票据本方账号在系统中是否存在进行校验<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2.【票据工作台】自定义分类编辑规则中选择“金额”或“价税合计”，其他票据和银行票据智能做账凭证均可取值<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3.【票据工作台】总账核算存货模式【统计分析】界面增加出入库单数量统计<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>4.【票据工作台】编辑票据信息返回票据工作台定位不变<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>5.【票据工作台】凭证及分录相关合并参数整合<br/>
                    （1）编辑分类中去掉“合并分录及凭证”，凭证合并分录将自动合并<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image005.png')]"
                      lazy>
                    </el-image>
                    （2）【设置引导】中去掉第6项 凭证合并分录设置，默认分录自动合并<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>6.【票据工作台】利息支出和社保下票据智能做账，【智能做账】凭证预览列表界面显示待处理标识<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>7.【票据工作台】票据详情展示方式显示火车票、客车票、飞机票的税额及价税合计<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>8.【票据工作台】支持银行票据-转入/转出分类下票据按往来单位分类<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image009.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image010.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>9.一般纳税人销项发票简易计税处理
                    记忆用户上次选择结果，后续税率为6%的销项发票凭证中税目按记忆的结果生成<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>10.【全部节点】票据生成的凭证修改入账期间问题处理<br/>
                  </li>
                  <li>11.【进项发票】/【销项发票】查询条件中“类型”条件隐藏<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image012.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>12.【进项发票/销项发票/银行对账单】标准导入模板业务类型支持选择<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image013.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image014.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image015.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    13.【进项发票/销项发票】导入发票数量及单价精度按用户设置的”dzf009数量精度”和”dzf010单价精度”参数处理<br/>
                  </li>
                  <li>
                    14.【银行对账单】选择勾选清单合并生成凭证时，凭证分录行按交易日期排序<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image016.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image017.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>15.【银行对账单】合并规则中摘要生成规则增加“开票日期”、“往来单位”及“业务类型”选项<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image018.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    16.【银行对账单】列表展示字段位置调整<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image020.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    17.开票日期为当前日期的发票识别处理
                    上传当日进入“未识别票据”分类，提示“当日开具发票无法查验，请两日后点击【重新识别】”<br/>
                  </li>
                  <li>
                    18.【图片浏览】快速制单损益结转改为非强制校验<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    19.【图片浏览】去掉部分按钮及查询条件<br/>
                    （1）隐藏【批量上传】按钮 <br/>
                    （2）隐藏“票据类型”查询条件 <br/>
                    （3）隐藏“图片组”查询条件<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190827_2">凭证管理优化</h3>
                <ul>
                  <li>1、填制凭证界面下方，票据类型显示与增值税申报表一致：<br/>
                    （1）一般纳税人凭证下方显示为：普票和其他、未开票；专票是默认值不显示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image023.png')]"
                      lazy>
                    </el-image>
                    （2）小规模纳税人凭证下方显示：专票、未开票和其他；普票是默认值不显示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190827_3">期末处理优化</h3>
                <ul>
                  <li>
                    1、新增“结转模板”按钮，可快速打开“期末结转模板”界面，方便用户查看和调整模板<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image025.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、附加税模板优化：新增“计提税种”列，期末结转-“附加税结转”根据模板设置的税种计提<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、成本结转优化<br/>
                    （1）结转辅助生产成本功能优化：科目【400102_辅助生产成本】的所有末级科目均可转到入【4101_制造费用】的第一个末级明细科目中（如需调整请结转完成后到凭证管理节点进行调整）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image028.png')]"
                      lazy>
                    </el-image>
                    （2）结转制造费用功能优化：【4101_制造费用】的所有未级科目均可转入【40010103_制造费用】的第一个未级明细科目中（如需调整请结转完成后到凭证管理节点进行调整）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image029.png')]"
                      lazy>
                    </el-image>
                    （3）工业企业-原材料销售成本结转科目优化：销售成本科目取“其他业务成本/材料销售成本”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image030.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image030.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_4">工资管理优化</h3>
                <ul>
                  <li>
                    1、入账设置节点-部门费用设置，支持即时新增部门，并同步到辅助核算-部门档案 <br/>
                  </li>
                  <li>
                    2、职员信息节点-支持即时新增部门，并同步到辅助核算-部门档案。<br/>
                  </li>
                  <li>
                    3、其他易用性优化。<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_5">库存模块优化</h3>
                <ul>
                  <li>
                    1、库存入账设置：增加“材料销售收入”科目，工业企业-销售材料出库时收入科目取该科目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image031.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image031.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image032.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image032.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、库存明细账优化<br/>
                    （1）导出：增加“存货编码”列；<br/>
                    （2）打印：默认打印全部查询结果<br/>
                    （3）打印：默认不按存货分页；“按存货分页打印”放在打印选项里自行选择。<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_6">纳税申报优化</h3>
                <ul>
                  <li>
                    1、一般纳税人增值税申报表取数优化：<br/>
                    （1）一般计税和简易计税税表取数功能优化<br/>
                    （2）新增旅客运输进项从发票清单取数<br/>
                  </li>
                  <li>
                    2、新增6个地区的财报导出税局模式:云南、四川、甘肃、贵州、吉林、内蒙古<br/>
                  </li>
                  <li>
                    3、新增3个地区的纳税申报表：云南、甘肃、吉林；支持的税种：增值税、附加税、企业所得税<br/>
                  </li>
                  <li>
                    4、纳税信息节点：增加一个字段“是否签约税库银三方协议”<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_7">纳税工作台优化</h3>
                <ul>
                  <li>
                    1、界面显示、功能按钮、取数效率、易用性等全面优化<br>
                    <el-image
                      :src="require('@/assets/changelog/20190827/image033.png')"
                      :preview-src-list="[require('@/assets/changelog//20190827/image033.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_8">报税客户端优化</h3>
                <ul>
                  <li>
                    1、个税申报优化：适配税局的自然人扣缴客户端登录界面更改（北京、江苏、山东、重庆地区）；8月8号已发版<br/>
                  </li>
                  <li>
                    2、报税客户端右侧申报税种-个人所得税（正常工资薪金、劳务报酬、外籍薪金）：打开链接到在线会计工资表新版界面<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190827_9">其他易用优化</h3>
                <ul>
                  <li>
                    1、会计科目：新增和修改会计科目过滤空格和乱码<br/>
                  </li>
                  <li>
                    2、数量金额总账及明细账增加“规格型号”显示<br/>
                  </li>
                  <li>
                    3、库存模块停用再启用后原“存货档案”核算科目保持不变<br/>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 8 27 end-->

        <!--2019 7 25 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190725"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2 style="color: #FF5722;">V5.190725&nbsp;&nbsp;<span class="layui-badge-rim">2019-07-25</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190725_1">票据管理优化</h3>
                <ul>
                  <li>1.【票据工作台】-【设置引导】增加票据合并数量参数，勾选合并范围内票据按“合并票据数量”设置数量合并生成凭证<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2.【票据工作台】开启按往来单位分组后票据按往来单位合并入账<br/>
                    收入、库存采购、成本及银行票据（转入及转出）分类下票据支持按往来单位合并生成凭证；<br/>
                    银行票据无往来单位分类，仅凭证按往来单位合并生成；<br/>
                    收入、库存采购及成本下已上传票据需点击【整理分类】后才可生效；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3.【票据工作台】图片状态下查看票据增加【刷新】按钮<br/>
                    注：原该界面【作废】、【跨期】及【下载】按钮统一放在【更多】下拉按钮下<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>4.【票据工作台】-【编辑分类】中系统预置的非末级分类“入账科目”、“结算科目”及“税行科目”三个字段隐藏<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>5.【票据工作台】-【手动凭证】界面支持快速制单，无需跳转【图片浏览】处理<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>6.【票据工作台】代开发票国税查验返回备注中公司名称与其他信息无法分隔进问题票据的问题处理<br/>
                    后续如发现已开发票公司名称识别错误，进入问题票据标识“收付款方名称与本公司名称不一致”，请及时联系大账房客服处理；<br/>
                    另建议填写代开发票的公司信息时，将公司名称前后加空格，以便系统进行区分，减轻财务人员工作量；<br/>
                  </li>
                  <li>7.【扫描客户端】及【上传图片】扫描票据时选择票据类型为“存货”或“费用”增加提示，避免用户选择票据类型导致票据分类错误；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image006.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>8.【进项发票】/【销项发票】及【票据工作台】科目开启存货辅助及数量核算校验调整<br/>
                    总账核算存货（存货大类+辅助明细）模式下，生成凭证仅校验库存相关票据的入账科目是否开启存货辅助及数量核算，若该公司不涉及原材料及销售材料收入科目核算，则这两个科目无需开启存货辅助及数量核算；<br/>
                  </li>
                  <li>9.【票据管理】生成凭证专普票勾选标识及凭证分组<br/>
                    业务类型为进项票据/成本/费用/资产的票据，增值税专用发票及机动车发票勾选专票，其他票均勾选普票；<br/>
                    业务类型为收入的票据，增值税专用发票及机动车发票勾选专票，其他发票勾选普票，机打发票一般纳税人勾选普票，小规模纳税人勾选未开票；<br/>
                    银行票据不勾选任何标识；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image008.png')]"
                      lazy>
                    </el-image>
                    业务类型为资产的票据生成凭证，区分专普票；<br/>
                  </li>
                  <li>10.【进项发票】一键取票期间条件调整，原“开票期间”调整为开票日期区间，原“认证期间”调整为“认证所属期”<br/>
                    选择按开票日期区间取票，用户可取开票日期至今一年内的发票数据；<br/>
                    选择按认证所属期取票，用户可取发票认证所属期为所选月份的发票数据；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>11.【进项发票】导入及一键取票入账期间取值<br/>
                    标准模板导入：入账期间取导入清单中入账期间，若入账期间为空取当前登录期间；<br/>
                    一键取票：入账期间取发票认证所属期；<br/>
                  </li>

                  <li>12.【进项发票】/【销项发票】节点生成凭证相关按钮处理<br/>
                    启用库存模式及总账核算存货（存货大类+辅助明细）模式下，进销项发票清单节点生成凭证按钮进行整合，优化按钮排序；<br/>
                    启用库存模式<br/>
                    进项发票<br/>
                    【生成入库】与【生成凭证】按钮合并为【生成凭证】，按钮重新排序；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image010.png')]"
                      lazy>
                    </el-image>
                    销项发票<br/>
                    【生成出库】与【生成凭证】按钮合并为【生成凭证】，按钮重新排序；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image011.png')]"
                      lazy>
                    </el-image>
                    总账核算存货（存货大类+辅助明细）<br/>
                    进项发票<br/>
                    【存货】与【费用】按钮合并为【生成凭证】，按钮重新排序<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image012.png')]"
                      lazy>
                    </el-image>
                    销项发票<br/>
                    【存货】与【劳务】按钮合并为【生成凭证】，按钮重新排序<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image013.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    13.【进项发票】/【销项发票】节点标准模板导入增加校验“开票项目”不可为空<br/>
                  </li>
                  <li>
                    14.【进项发票】/【销项发票】节点一键取票及导入“机动车统一销售发票”处理<br/>
                    机动车统一销售发票一键取票及导入显示、生成凭证专普勾选标识及税表取数均按增值税专用发票处理；<br/>
                    可在【票据管理】-【票据工作台】-【设置引导】中设置票据生成凭证的“凭证日期”取值<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image014.png')]"
                      lazy>
                    </el-image>
                    进项税表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image015.png')]"
                      lazy>
                    </el-image>
                    销项税表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image016.png')]"
                      lazy>
                    </el-image>
                    生成凭证<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image017.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>15.【图片浏览】识别中票据做账处理<br/>
                    正在识别中的票据不支持快速制单及单据图片做账，增加相关校验<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image018.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    16.【银行对账单】查询条件支持按收支类型检索<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190725_2">凭证管理优化</h3>
                <ul>
                  <li>1、凭证打印：用户可自行设置打印哪些辅助项<br/>
                    （1）【打印】-【打印设置】：打印辅助核算项目 增加“设置”功能<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image020.png')]"
                      lazy>
                    </el-image>
                    （2）辅助项打印设置：根据当前科目核算的辅助项，用户可根据需要选择需要打印的辅助项<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190725_3">账簿账表优化</h3>
                <ul>
                  <li>
                    1、账表打印增加“单位”显示<br/>
                  </li>
                  <li>
                    2、科目总账、科目明细账：增加科目“tips”显示，方便用户查看较长科目名称<br/>
                  </li>
                  <li>
                    3、根据财政局2016年12月3日发布的《增值税会计处理规定》，调整资产负债表取数算法，根据“应交税金”明细科目进行“应交税金”重分类<br/>
                    说明：当选中“明细科目分析填列--应交税金”重分类后，当“应交增值税、未交增值税、待抵扣进项税、待认证进项税额、增值税留底税额”这5个科目期末为借方余额时，分析到“其他流动资产”表项；“待转销项税额”科目余额分析到“其他流动负债”表项<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、财报（企业会计准则）：利润表、利润表季报【综合收益总额】=【净利润】+【其他综合收益的税后净额】<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_4">期末处理优化</h3>
                <ul>
                  <li>
                    1、成本结转：当成本结转方式为手工结转或比例结转时，支持多月份批量操作 <br/>
                  </li>
                  <li>
                    2、成本结转：未取到销售商品的成本单价时支持用户手工指定成本单价。<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_5">工资管理优化</h3>
                <ul>
                  <li>
                    1、工资管理优化为四个功能点：入账设置、职员信息、社保公积金、工资表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、工资表导入：支持从自然人税收管理系统扣缴客户端“综合所得申报-申报表报送”导出的模板，并在导入节点增加操作指引<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_6">库存模块优化</h3>
                <ul>
                  <li>
                    1、库存入账设置：增加暂估入库科目，原入库单“暂估”按钮隐藏，期末处理成本结转根据暂估入库科目一次性暂估存货<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image025.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、存货档案：“规格”、“型号”合并为一列“规格（型号）”，同时历史数据升级为“规格*型号”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、出入库单：存货参照增加按科目编码排序及过滤功能<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、库存成本表、库存明细账：增加A5打印纸模板<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image028.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_7">会计制度优化</h3>
                <ul>
                  <li>
                    新增“行政单位会计制度”的凭证处理及账簿自动生成，其他功能不提供。<br>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_8">纳税申报优化</h3>
                <ul>
                  <li>
                    1、新增广东、安徽两个地区的纳税申报表<br/>
                  </li>
                  <li>
                    2、新增广东、安徽、海南三个地区财报税局格式导出模板<br/>
                  </li>
                  <li>
                    3、一键报税客户端：江苏、山东地区申报优化<br/>
                  </li>
                  <li>
                    4、企业所得税申报表：根据总局2019年第23号《企业所得税预缴纳税申报表部分表单及填报说明》修订各地区申报表<br/>
                  </li>
                  <li>
                    5、纳税填报节点新增“取数来源”按钮，与参数设置中的“取数来源”联动<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190725/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20190725/image029.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    6、增值税纳税申报表选择“从清单取数”算法优化：根据在销项清单中选择的业务类型及在票据工作台选择的票据分类，取数到增值税纳税申报表中。<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190725_9">其他易用优化</h3>
                <ul>
                  <li>
                    1、凭证管理：打印辅助项时自动打印辅助明细编码<br/>
                  </li>
                  <li>
                    2、总账核算存货：暂估及成本结转界面存货增加“规格型号”显示<br/>
                  </li>
                  <li>
                    3、附加税计提方式调整，取消连续月计提校验<br/>
                  </li>
                  <li>
                    4、优化财报表头查询：增加“前后切换查询期间”功能<br/>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 7 25 end-->

        <!--2019 6 26 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190626"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190626&nbsp;&nbsp;<span class="layui-badge-rim">2019-06-26</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190626_1">票据优化</h3>
                <ul>
                  <li>总账核算存货模式的匹配规则设置为存货名称+计量单位时存货匹配及生成规则<br/>
                    新增存货，“规格(型号)”字段为空<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image001.png')]"
                      lazy>
                    </el-image>
                    新增存货别名，“规格(型号)”按票据中该存货对应规格(型号)处理<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>外币票据智能做账优化处理<br/>
                    增加是否设置外币汇率校验及提示，增加会计科目是否设置外币核算校验及提示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image003.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>“银行票据”的票据信息支持外币金额编辑，编辑后该票据按外币业务进行入账处理<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>智能做账凭证预览列表界面点击【保存】增加成本结转提示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>智能做账生成资产卡片入账科目结算科目找末级<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>一般纳税人取得2019年4月1日以后的其他票据（火车票、飞机票及客车票）进项税抵扣<br/>
                    基于税政“国家税务总局公告2019年第15号”文件，4月1日起纳税人购进国内旅客运输服务，其进项税额允许从销项税额中抵扣）<br/>
                    火车票按票面金额÷（1+9%）×9%予以抵扣；<br/>
                    客车票按票面金额÷（1+3%）×3%予以抵扣（要求识别信息中包含旅客信息）；<br/>
                    飞机票按（票价+燃油附加费）÷（1+9%）×9%；<br/>
                    三种票据税目统一按“旅客运输服务进项税（非专票）”处理；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image008.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>图片浏览快速制单状态同步票据工作台，在已做账票据状态中可查询<br/>
                    山东社保票据识别及分类处理<br/>
                    票据识别并进入银行票据-社保分类下，用户编辑规则或直接调整生成的凭证；<br/>
                    进销项、票据工作台入账设置及编辑分类增加“税行科目”，可设置同一业务类型不同票据按不同税行科目生成凭证<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image010.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>进销项发票节点页面右下角按查询结果显示票据金额、税额及价税合计的合计数<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image012.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>进销项生成凭证选择合并分录，科目、税目、税率均一致的两条税表表项合并<br/>
                    进销项、银行对账单批量生成凭证的效率进行优化<br/>
                    总账核算存货模式未设置存货成本核算方式，点击【银行对账单】-【生成凭证】按钮不提示<br/>
                    进销项发票节点新增/修改弹窗中货物及劳务名称下拉列表中显示为存货名称+规格(型号)<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>一键取票弹窗中纳税人识别号过滤空格<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>进销项发票查询条件增加按“开票项目”查询<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image015.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>进销项、银行对账单选中票据进行【入账设置】后，勾选标识不清空<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image016.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>银行对账单编辑账号信息弹窗中的“关联科目”字段显示为科目编码+科目名称<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    扫描客户端去掉按期间入账和按业务日期入账选项<br/>
                    可在【票据管理】-【票据工作台】-【设置引导】中设置票据生成凭证的“凭证日期”取值<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image018.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>扫描增值税发票按收付款方信息自动分发至票据所属公司<br/>
                    针对单公司票据数量较少，但公司数量较多的业务场景，提供票据跨公司功能；<br/>
                    添加至发票跨公司白名单的公司，在扫描客户端扫描票据后系统自动分发票据至票据所属公司，如需票据自动分发功能可联系客服处理；<br/>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190626_2">凭证优化</h3>
                <ul>
                  <li>1、“填制凭证”增加【单价】显示功能：<br/>
                    （1）参数设置：制单时显示单价，系统默认不显示，可根据需要开启显示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image019.png')]"
                      lazy>
                    </el-image>
                    （2）填制凭证：根据科目开启余额及数量显示，系统自动计算单价（单价=余额/数量）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image020.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、【填制凭证】：小规模纳税人增加“未开票”票据属性<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3、“凭证管理”根据用户操作习惯默认列宽<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190626_3">账表优化</h3>
                <ul>
                  <li>
                    1、“辅助明细账”增加【按辅助名称分页导出】功能：<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、财报数据（资产负债表、利润表、利润表季报、现金流量表、现金流季报）打印增加【单位负责人】、【财务负责人】、【制表人】字段
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190626_4">资产模块优化</h3>
                <ul>
                  <li>
                    1、折旧方式增加“年数总和法”<br/>
                    （1）资产类别：调整折旧方式“年数总和法”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image024.png')]"
                      lazy>
                    </el-image>
                    （2）资产卡片：根据选择的资产类别，带出折旧方式<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image025.png')]"
                      lazy>
                    </el-image>
                    （3）期末处理：根据年数总和法，计算折旧额<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、折旧汇总表：增加【打印】及【导出】功能<br/>
                    应用场景：资产卡片较多时，有些客户会打印折旧汇总表作为凭证附件<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190626_5">会计制度优化</h3>
                <ul>
                  <li>
                    “农民专业合作社财务会计制度”新增【盈余分配表】和【权益变动表】自动编制功能<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190626_6">基础设置优化</h3>
                <ul>
                  <li>
                    1、科目下级转辅助：放开年结限制<br/>
                  </li>
                  <li>
                    2、“1012_其他货币资金”科目增加“非现金科目”属性，开启后凭证录入该科目，不进行现金流分析<br/>
                    应用场景：1012_其他货币资金，有些客户会做明细核算，核算短期不会变现的业务<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image028.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、标准科目：“非限定性净资产”增加“非限定性流动资产”及“非限定性非流动资产”科目，方便用户核算明细<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image029.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190626_7">纳税申报相关优化</h3>
                <ul>
                  <li>
                    1、【税费计算】：一般纳税人增值税增加“加计抵减本期实际抵减额”项<br>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image030.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image030.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、【企业信息】：征收方式调整-个体户-查账征收增加“专项扣除”项<br>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image031.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image031.png')]"
                      lazy>
                    </el-image>
                    【期末结转】：期末计提所得税，应纳税所得额=利润总额-弥补以前年度亏损-投资者减除费用-专项扣除。<br/>
                    【税费计算】：增加“专项扣除”项，专项扣除等于从2019年1月（若开始生产经营月>2019年1月，则从开始生产经营月算起）累计到查询月的累计数。<br/>
                    【纳税申报】：修改个体户《个人所得税生产经营所得申报表》。<br/>
                  </li>
                  <li>
                    3、【纳税申报】：新增4个地区的纳税申报表: 福建、辽宁、湖南、青岛；<br/>
                    支持的税种：增值税、附加税、企业所得税、财务报表。<br>
                  </li>
                  <li>
                    4、【资产负债表】：新增4个地区财报税局格式导出模板：厦门、福建、辽宁、湖南；<br/>
                    税局格式导出增加操作说明<br>
                    <el-image
                      :src="require('@/assets/changelog/20190626/image032.png')"
                      :preview-src-list="[require('@/assets/changelog//20190626/image032.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    5、【客户端】：调整山东地区一般纳税人增值税申报。<br>
                  </li>
                  <li>
                    6、【客户端】：印花税、工会经费可以实现零申报<br>
                  </li>
                  <li>
                    7、【客户端】：印花税、工会经费可以获取期初数据<br>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190626_8">其他优化</h3>
                <ul>
                  <li>
                    1、凭证管理：查询条件增加“已记账|未记账”筛选条件<br/>
                  </li>
                  <li>
                    2、库存模块：库存成本表和库存明细账增加规格(型号)查询条件<br/>
                  </li>
                  <li>
                    3、操作日志：优化“删除|批量删除”操作日志
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 6 26 end-->

        <!--2019 5 28 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190528"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190528&nbsp;&nbsp;<span class="layui-badge-rim">2019-05-28</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190528_1">票据优化</h3>
                <ul>
                  <li>进销项、银行对账单及票据工作台凭证中会计科目相关处理<br/>
                    往来科目的明细科目匹配及新增<br/>
                    本级及下级科目均未匹配，按上级科目处理<br/>
                  </li>
                  <li>【票据工作台】银行回单摘要生成规则<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>【票据工作台】总账核算存货（存货大类）自动带出出入库科目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>【智能做账】生成资产卡片结算科目辅助生成<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>智能做账所有分录行金额均为0<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>双击票据名称可打开查看票据信息，同右键打开<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>客户端下载链接<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>“银行账号不存在”检测项显示优化，点击【更多】查看全部<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>问题票据和未识别票据分类排序<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>期间切换支持左右键切换上下月<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>关账检查-跨期关账检查<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image010.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>一般纳税人取得2019年4月1日以后的发票进项税抵扣-专票、电子普票<br/>
                    基于税政“国家税务总局公告2019年第15号”文件，4月1日起纳税人购进国内旅客运输服务，其进项税额允许从销项税额中抵扣）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image012.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>票据工作台增加操作日志<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    反建账校验及相关处理<br/>
                    票据全部作废后可反建账<br/>
                    反建账清空数据<br/>
                  </li>
                  <li>启用库存模式存货匹配优化<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image015.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image016.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>启用库存进销项匹配存货弹窗支持按规格、型号检索<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>进销项、银行对账单入账设置支持模糊检索<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image018.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>启用库存及总账核算存货匹配存货界面选择存货档案显示结存数量<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image020.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>一键取票绑定的时候，公司名称不一致校验提示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>“一键取票”发票提取月份增加按“认证期间”取票<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>进项发票及票据工作台节点生成入库单接口增加认证字段<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    进销项、银行对账单同一业务类型的同一结算方式可按不同科目生成凭证<br>
                  </li>
                  <li>银行对账单查询条件增加入账期间<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>【银行对账单】-【合并规则】选择按往来单位合并生成凭证，对方单位为空且业务类型不一致的不合并<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image025.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190528_2">总账核算存货优化</h3>
                <ul>
                  <li>1、“存货档案”增加【存货合并】功能：<br/>
                    应用场景：如由于开票不规范导致同一存货生成了多个存货档案和多条存货数据，可通过使用“存货合并”功能解决<br/>
                    （1）勾选需要合并的存货，点击【存货合并】按钮<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image026.png')]"
                      lazy>
                    </el-image>
                    （2）注意：系统默认合并为编码最小的存货【合并后存货】（用户可修改），其他勾选的存货【被合并存货】合并后被替换掉。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image027.png')]"
                      lazy>
                    </el-image>
                    （3）【确认】后，【被合并存货】原相关数据（期初数据、出入库单、凭证）全部替换为【合并后存货】<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image028.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image029.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、存货档案增加【更新导入】功能<br/>
                    应用场景：如历史导入的存货档案未维护【规格(型号)】、【计量单位】等字段，可通过使用“更新导入”功能，在EXCEL表中批量维护后，再导入系统。<br/>
                    （1）勾选需补充存货信息的数据，点击【更新导入】按钮，【点击下载】导出原档案数据<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image030.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image030.png')]"
                      lazy>
                    </el-image>
                    （2）在EXCLE表中维护相关存货信息后，通过【更新导入】按钮，选中维护好的文件，导入系统。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image031.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image031.png')]"
                      lazy>
                    </el-image>
                    （3）在EXCLE表中维护好的存货信息就更新到系统里对应的存货上了。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image032.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image032.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190528_3">库存模块优化</h3>
                <ul>
                  <li>
                    1、存货档案增加【别名】功能：<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image033.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image033.png')]"
                      lazy>
                    </el-image>
                    （1）选择需要维护存货的别名，维护【别名】名称、规格(型号)、计量单位、计算模式及换算关系<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image034.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image034.png')]"
                      lazy>
                    </el-image>
                    （2）【进项发票】和【销项发票】节点，生成入库单（出库单）根据存货别名匹配生成存货相关数据<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image035.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image035.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image036.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image036.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、存货档案增加【存货合并】功能<br/>
                    应用场景：如由于开票不规范导致同一存货生成了多个存货档案和多条存货数据，可通过使用“存货合并”功能解决<br/>
                    （1）勾选需要合并的存货，点击【存货合并】按钮<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image037.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image037.png')]"
                      lazy>
                    </el-image>
                    （2）注意：系统默认合并为编码最小的存货【合并后存货】（用户可修改），其他勾选的存货【被合并存货】合并后被替换掉<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image038.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image038.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image039.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image039.png')]"
                      lazy>
                    </el-image>
                    （3）【确认】后，【被合并存货】原相关数据（期初数据、出入库单、凭证）全部替换为【合并后存货】<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image040.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image040.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image041.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image041.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190528_4">会计制度优化</h3>
                <ul>
                  <li>
                    “农民专业合作社财务会计制度”新增【资产负债表】自动编制功能。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image042.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image042.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190528_5">纳税申报相关优化</h3>
                <ul>
                  <li>
                    1、增值税申报表：适配新政“国家税务总局公告2019年第15号”文件：<br/>
                    4月1日起纳税人购进国内旅客运输服务，其进项税额允许从销项税额中抵扣<br/>
                  </li>
                  <li>
                    2、新增4个地区的纳税申报表: 湖北、浙江、上海、深圳，支持的税种：增值税、附加税、财务报表、企业所得税<br>
                  </li>
                  <li>
                    3、财报税局格式导出新增地区：广西、海南<br>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190528_6">预警设置优化</h3>
                <ul>
                  <li>
                    1、系统预置两个预警设置，当超过预警值，登录弹出提醒框<br/>
                    （1）小型微利企业资产总额：资产总额季度平均值不超过5000万元<br/>
                    （2）小型微利企业年度应纳税所得额：年度应纳税所得额不超过300万元<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image043.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image043.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190528/image044.png')"
                      :preview-src-list="[require('@/assets/changelog//20190528/image044.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190528_7">其他优化</h3>
                <ul>
                  <li>
                    1、资产【折旧明细表】：汇总打印时可选择打印哪些行项目和列项目<br>
                  </li>
                  <li>
                    2、凭证管理：导出及导入凭证增加附单据数<br>
                  </li>
                  <li>
                    3、民间非营利组织会计制度：优化现金流量分析算法<br>
                  </li>
                  <li>
                    4、库存模块：出入库单新增发票纸模板打印<br>
                  </li>
                  <li>
                    5、辅助余额表：当选择【无余额无发生不显示】或【有余额无发生不显示】时算法优化<br>
                  </li>
                  <li>
                    6、职员档案：增加“封存”功能；增加“批量修改”功能<br>
                  </li>
                  <li>
                    7、工资表：调整A5纸打印模板<br>
                  </li>
                  <li>
                    8、纳税工作台：增加“申报完成”列，纳税申报完成后，会计可手工勾选<br>
                  </li>
                  <li>
                    9、税费计算：优化所得税的“实际已缴纳税额”字段的算法<br>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 5 28 end-->

        <!--2019 4 28 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190425"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190427&nbsp;&nbsp;<span class="layui-badge-rim">2019-04-27</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190425_1">总体优化</h3>
                <ul>
                  <li>预制行业增值税税负：管理端建账界面，根据维护【国家标准行业】预制对应增值税税负率<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>在线端：首页增值税税负预警线根据维护的行业对应的税负率进行显示预警提示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190425_2">凭证优化</h3>
                <ul>
                  <li>1、适配最新税政“国家税务总局公告2019年第15号”文件<br/>
                    一般纳税人：新增13%和9%两档税率，凭证保存自动生成对应税表表项<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>2、增加凭证封皮打印<br/>
                    打印：新增【打印封皮】选项，支持多公司多模板打印，方便用户凭证装订<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>3、界面显示优化：科目存货辅助核算显示存货的规格(型号)<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190425_3">票据优化</h3>
                <ul>
                  <li>
                    1、进项发票|销项发票：选中发票行点“入账设置”用户可修改发票的入账科目、摘要、结算科目等<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、进项发票|销项发票：通过“一键取票”生成的清单，当参数设置“dzf021 一键取票方式”为“手动制单”时，生成库存模块按一张发票生成一张入库单（出库单）及一张凭证<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、进项发票|销项发票：增加票据明细行设置业务类型，一张发票可支持多种业务<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、进项发票|销项发票：启用库存模块，生成存货均显示匹配存货弹窗<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    5、进项发票|销项发票：一般纳税人新增发票时默认改为增值税专用发票<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image010.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    6、进项发票|销项发票：导入模板增加规格(型号)和计量单位列<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    7、进项发票|销项发票：进销项清单存货匹配时可按规格(型号)进行模糊搜索<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image012.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    8、进项发票|销项发票：列表去掉“类型”字段<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image013.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    9、银行对账单：列表显示增加“本方银行名称”和“本方银行账号”字段<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image014.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    10、银行对账单：银行对账单与银行回单数据的手动勾对<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image015.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    11、银行对账单：通用模板新增支持如下银行<br/>
                    （1）、中国农业银行股份有限公司鄂温克族自治旗支行<br>
                    （2）、中国银行股份有限公司呼伦贝尔市成吉思汗广场银行<br/>
                    （3）、中国建设银行股份有限公司海拉尔天润支行<br/>
                    （4）、扬州农商行<br/>
                  </li>

                  <li>
                    12、【图片浏览】删除改为作废，去掉【识别】按钮<br/>
                  </li>

                  <li>
                    13、【上传图片】、【图片浏览】-【批量上传】及客户端，票据类型字段默认值改为“全部”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image016.png')]"
                      lazy>
                    </el-image>
                  </li>

                  <li>
                    14、新增【票据工作台】节点，针对识别票据实现对票据自动分类到匹配存货再到智能做账处理的全流程处理（旗舰版）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190425_4">结账办理</h3>
                <ul>
                  <li>
                    原税收测算节点更新为税费计算：<br/>
                    支持增值税、其他税费、所得税的计提过程<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image018.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190425_5">财报优化</h3>
                <ul>
                  <li>
                    1、税局格式导出新增地区：上海、湖北、江苏、北京、河南<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、新增财报英文导出格式（仅支持小企业会计准则）<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、利润表和现金流量表支持“本月金额”与“本年累计金额”列切换<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190425_6">资产优化</h3>
                <ul>
                  <li>
                    资产类别：【折旧方式】、【净残率】、【使用年限（月）】的调整，新增卡片自动读取“资产类别”节点维护后的信息<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image025.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190425_7">纳税申报优化</h3>
                <ul>
                  <li>
                    1、根据“国家税务总局公告2019年第15号”文件调整增值税一般纳税人纳税申报表<br>
                  </li>
                  <li>
                    2、新增4个地区的纳税申报表:天津、河北、广西、海南，支持的税种：增值税、附加税、财务报表、企业所得税<br>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190425_8">其他优化</h3>
                <ul>
                  <li>
                    1、关账检查：使用了“工资管理--工资表”的检查“工资薪金计提”数据，未使用工资表不检查<br>
                  </li>
                  <li>
                    2、期末处理：凭证生成顺序及算法优化（损益结转凭证顺序优化：先结转收入，后结转费用；附加税计算结果<0.01时不生成凭证）<br>
                  </li>
                  <li>
                    3、标准科目：升级【其他应付款】科目时，允许多个下级科目指定同一升级科目并对升级科目增加操作说明<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、用户生效日期后才可登录系统<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    5、纳税工作台增加印花税查询<br>
                    <el-image
                      :src="require('@/assets/changelog/20190425/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20190425/image028.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 4 28 end-->

        <!--2019 3 28 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190328"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190328&nbsp;&nbsp;<span class="layui-badge-rim">2019-03-28</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190328_1">总体优化</h3>
                <ul>
                  <li>用户可以从在线会计一键进入管理平台<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>会计记账查询节点增加集中预警查询功能<br/>
                    会计记账查询可集中查看公司做账进度及预警情况，已达预警上线的公司，通过点击“详情”查询预警项目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image002.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image002.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190328_2">企业信息优化</h3>
                <ul>
                  <li>企业信息节点增加修改功能：新增“成本结转方式、小微企业标识、城建税率、地方教育附加税率”的修改。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190328_3">票据管理优化</h3>
                <ul>
                  <li>
                    银行对账单：新增12家银行导入模板“平安银行-深圳分行、兴业银行-深圳分行、上海浦东发展银行-深圳分行、深圳农村商业银行-深圳分行、中国银行-内蒙古分行、长沙银行、长沙农商银行、长沙地区建设银行、长沙平安银行、中原银行、工商银行泰安分行、济宁银行泰安分行”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image004.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image004.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_4">凭证管理优化</h3>
                <ul>
                  <li>
                    查询条件优化：去掉时间轴，表头增加期间快速切换<br/>
                    查询单期间：通过前后箭头可进行单个期间凭证的快速切换<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image005.png')]"
                      lazy>
                    </el-image>
                    查询多期间：点击期间框出现双日历，选择查询的开始期间和结束期间即可<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image006.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image006.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    系统自动标记现金流分析可能有误凭证<br/>
                    系统对于不规范且无法分析出业务含义的凭证，现金流量分析可能会不准确，那么系统会标识出来，且可在凭证管理中单独查询出来，用户再根据需要进行修改<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image007.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image008.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image008.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    凭证保存时税目自动生成，并据此生成纳税申报表数据<br/>
                    根据客户录入的收入类凭证（及采购农产品凭证），系统自动分析形成税表表项，生成纳税申报表数据<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image009.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image010.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_5">期末处理优化</h3>
                <ul>
                  <li>
                    期末处理支持联查凭证：鼠标指向已结转的项目，提示可联查凭证，点击“联查凭证”跳转凭证界面查看详情<br>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image011.png')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image012.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_6">财务报表优化</h3>
                <ul>
                  <li>
                    企业会计准则：根据【财会〔2018〕15号文件】精神调整会计报表<br>
                    1、新增3个科目：1481_持有待售资产、1482_持有待售资产减值准备、2245_持有待售负债<br>
                    2、调整资产负债表项并删除旧表项“专项储备（行次59）”<br>
                    3、调整利润表表项<br>
                  </li>
                  <li>
                    小企业会计准则<br>
                    1、新增2个科目：1321_受托代销商品、2314_受托代销商品款<br>
                    2、调整资产负债表项：上述两科目计入“存货”表项：原有算法上+1321（借方）-2314（贷方）<br>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_7">资产优化</h3>
                <ul>
                  <li>
                    1、资产卡片：界面字段优化调整<br/>
                    增加【录入当期一次提足折旧】选项，勾选后，当期录入的卡片可当月一次提足折旧（支持财税[2018]54号文件）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、资产类别：根据资产分类名称预制相应的使用年限<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190328/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20190328/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190328_8">工资表优化</h3>
                <ul>
                  <li>
                    工资计提增加企业承担的社保部分<br/>
                    1、入账设置节点增加企业承担部分的科目设置、比例设置<br/>
                    2、工资表列表增加企业承担部分的社保/公积金列<br/>
                    3、生成凭证-工资计提增加计提企业承担部分<br/>
                  </li>
                  <li>
                    工资表导入<br/>
                    支持从2019版自然人扣缴客户端导出个税申报表，可直接导入工资表<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_9">纳税申报表调整</h3>
                <ul>
                  <li>
                    1、2018年度汇算清缴报表增加开办费用的取数规则<br/>
                    2、国家税务总局公告2019年第2号，对增值税小规模纳税人可以在50%的税额幅度内减征资源税、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、耕地占用税和教育费附加、地方教育附加；根据政策调整印花税纳税申报表
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190328_10">其他优化</h3>
                <ul>
                  <li>
                    操作日志<br/>
                    （1）记录节点名称<br/>
                    （2）记录重要操作内容<br/>
                    （3）企业信息节点操作日志细化<br/>
                    （4）总账“存货管理-存货设置”节点操作日志细化
                  </li>
                  <li>
                    会计科目<br/>
                    （1）已使用的科目可以中间启用外币<br/>
                    （2）增加下级科目自动生成编码规则优化，从找最大码修改为可找中间的断号，如1122科目下级科目目前有112201-112256，112299，之前版本无法增加112257-112298之这些中间断号的二级科目
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 3 28 end-->
        <!--2019 2 26 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190226"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190226&nbsp;&nbsp;<span class="layui-badge-rim">2019-02-26</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190226_1">【银行对账单】增加银行导入模板</h3>
                <ul>
                  <li>银行对账单增加“乌鲁木齐农行”导入模板<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190226_2">工资管理优化</h3>
                <ul>
                  <li>新税法中规定，2018年10月1日起，外籍工资扣除数为由原来4800调整到5000元，工资表计算应纳税所得额同步调整<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190226_3">期末处理优化</h3>
                <ul>
                  <li>
                    1、根据国家税务总局公告2019年第4号政策优化期末增值税计提算法<br/>
                    (1）小规模纳税人发生增值税应税销售行为，合计月销售额未超过10万元（以1个季度为1个纳税期的，季度销售额未超过30万元，下同），免征增值税<br/>
                    (2）小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元，但扣除本期发生的销售不动产的销售额后未超过10万元的，其销售货物、劳务、服务、无形资产取得的销售额免征增值税<br/>
                    (3）政策执行日期201901
                  </li>
                  <li>
                    2、根据国家税务总局公告2019年第2号政策优化期末所得税计提算法<br/>
                    (1）自2019年1月1日至2021年12月31日，对小型微利企业年应纳税所得额不超过 100万元的部分，减按25%计入应纳税所得额，按20%的税率缴纳企业所得税<br/>
                    (2）对年应纳税所得额超过100万元但不超过300万元的部分，减按50%计入应纳税所得额，按20%的税率缴纳企业所得税<br/>
                    (3）符合年度应纳税所得额不超过300万元、从业人数不超过300人、资产总额不超过5000万元等三个条件的企业<br/>
                    (4）政策执行日期201901
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190226_4">资产优化</h3>
                <ul>
                  <li>
                    1、资产模块建账前已做账的资产允许在非启用月录入系统，从录入日期当月计提折旧<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、资产卡片中对“录入前已入账”字段，给出说明<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、资产导入增加防重复的校验<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190226_5">税表相关优化</h3>
                <ul>
                  <li>
                    1、根据国家税务总局公告2019年第4号公文，小规模纳税人发生增值税应税销售行为，合计月销售额未超过10万元（以1个季度为1个纳税期的，季度销售额未超过30万元，下同），免征增值税。调整小规模纳税申报表<br>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image005.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、国家税务总局公告2019年第2号，对小型微利企业年应纳税所得额不超过100万元的部分，减按25%计入应纳税所得额，按20%的税率缴纳企业所得税；对年应纳税所得额超过100万元但不超过300万元的部分，减按50%计入应纳税所得额，按20%的税率缴纳企业所得税。调整企业所得税纳税申报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、国家税务总局公告2019年第2号，由省、自治区、直辖市人民政府根据本地区实际情况，以及宏观调控需要确定，对增值税小规模纳税人可以在50%的税额幅度内减征资源税、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、耕地占用税和教育费附加、地方教育附加；根据政策调整附加税纳税申报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image007.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、国家税务总局关于修订《中华人民共和国企业所得税年度纳税申报表（A类，2017年版）》部分表单样式及填报说明的公告；修改在线会计企业所得税汇算清缴表样<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190226/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190226/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 2 26 end-->
        <!--2019 1 24 begin-->
        <li class="layui-timeline-item">
          <a name="V5.190124"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.190124&nbsp;&nbsp;<span class="layui-badge-rim">2019-01-24</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5190124_1">【银行对账单】增加银行导入模板</h3>
                <ul>
                  <li>银行导入模板：中国建设银行临河支行、中国农业银行临河支行、中国银行临河支行
                    、中国工商银行石狮支行<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190124_2">【凭证管理】功能优化</h3>
                <ul>
                  <li>（1）【导入凭证】：“导入凭证”成功后，自动刷新当前界面<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image002.jpg')]"
                      lazy>
                    </el-image>
                    目标凭证日期取值：默认“对应日期（例：20170102发生的凭证复制到201702，凭证自动取1月业务发生的对应日期显示20170202）”；指定日期（将凭证复制到指定一天显示做账日期）<br/>
                  </li>
                  <li>
                    （2）【外币凭证打印】：涉及外币业务的凭证，打印增加“币别”列，显示币种、汇率及原币金额<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    （3）【打印设置】：选择“打印辅助（不打印存货）；汇总打印”时，存货类科目合并打印<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image004.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image005.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5190124_3">结账办理</h3>
                <ul>
                  <li>
                    1、增值税优化<br/>
                    (1） 适配增值税减免新政<br/>
                    2019年新策：小微企业、个体工商户和其他个人的小规模纳税人，将增值税起征点由月销售额3万提高到10万。<br/>
                    大账房：调整小规模“计提增值税”算法<br/>
                    例：2019年第一季度销售收入为20万（月销售额≤10万，季度销售额≤30万），享受减免增值税，系统将当季的销项税转入政府补助生成减免税款的凭证。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image006.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image007.jpg')]"
                      lazy>
                    </el-image>
                    (2) 一般纳税人增值税结转优化<br/>
                    需求来源：有些会计的做账习惯是当期末应交增值税出现借方余额（不需缴税）也要转到未交增值税科目，而另一些会计却只有当应交增值税出现贷方余额时才结转。<br/>
                    一般纳税人进行增值税结转时，如果当期“应交增值税出现借方余额”时，可设置参数决定是否转入未交增值税科目（加盟商默认不结转）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、适配企业所得税新政<br/>
                    2019年新政：加大所得税优化力度，对小型微利企业年应纳税所得税不超过100万，100万元到300万元的部分，分别减按25％、50％计入应纳税所得额，使税负降至5％和10％<br/>
                    大账房：调整期末“计提所得税”算法<br/>
                    例：2019年第一季度利润总账为197200（应纳税所得税不超过100万，税负降至5％），所得税费用为9860<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image009.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、工业成本结转优化<br/>
                    结转产成品成本时，存货参照增加多选框，支持多选存货<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image010.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    4、关账检查优化<br/>
                    关账检查增加“往来挂账混乱”检查项，根据“应收、预收”，“应付、预付”及“其他应收、其他应付”三对挂账对象进行检查是否有挂账混乱的情况。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image011.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image012.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190124_4">财务报表优化</h3>
                <ul>
                  <li>
                    1、发生额余额表<br/>
                    发生额余额表查询条件增加“本年无余额无发生不显示”项，勾选后，可查询本年有数据发生但当期无发生无余额的科目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image013.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、数量账显示优化<br/>
                    （1）数量金额总账增加按钮【显示累计】：用户可选择是否展示本年累计列<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image014.jpg')]"
                      lazy>
                    </el-image>
                    （2）数量金额明细账增加按钮【显示单价】：默认不显示单价时一屏显示完<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image015.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3、财务概要信息表<br/>
                    财务概要信息表增加“环比变化”列，根据核算的项目进行本月和上月数据对比。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image016.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190124_5">根据2019年新个税法调整工资处理-正常薪金</h3>
                <ul>
                  <li>
                    增加专项附加扣除项，累计预扣法计算预扣税款<br>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image017.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    导入自然人扣缴客户端系统<br/>
                    1、导出人员信息，无需修改直接导入扣缴客户端人员信息<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image018.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image019.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image020.jpg')]"
                      lazy>
                    </el-image>
                    2、导出纳税申报表，无需修改直接导入扣缴客户端<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image021.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image022.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    自然人扣缴客户端系统导出报表，导入大账房工资表节点<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image023.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image024.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image024.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image025.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image025.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image026.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image026.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5190124_6">纳税申报优化</h3>
                <ul>
                  <li>
                    纳税信息增加企业社保编号字段，方便查看<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image027.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image027.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    纳税信息节点增加地方教育费税率<br/>
                    增加地方教育费税率，默认2%，可修改为1.5%<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image028.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image028.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    报表预制-修改附加税申报表<br/>
                    附加税申报表地方教育费附加税率取纳税信息地方教育费附加的税率<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image029.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image029.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    报表预制-修改通用增值税申报表上期留抵税额从账上取数<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image030.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image030.jpg')]"
                      lazy>
                    </el-image>
                  </li>

                </ul>
              </li>

              <li>
                <h3 id="v5190124_7">优化核定征收应税所得率</h3>
                <ul>
                  <li>修改所得税核定征收的应税所得率<br/>
                    允许录入的范围是0-100%之间<br/>
                    <el-image
                      :src="require('@/assets/changelog/20190124/image032.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20190124/image032.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2019 1 24 end-->

        <!--2018 12 27 begin-->
        <li class="layui-timeline-item">
          <a name="V5.181227"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.181227&nbsp;&nbsp;<span class="layui-badge-rim">2018-12-27</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5181227_1">票据管理优化</h3>
                <ul>
                  <li>1. 进项发票：一般纳税人一键取票功能优化<br>
                    修改取票方式，首次使用进项一键取票输入纳税人识别号和绑定码<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2. 进项、销项发票：明细清单，对折扣额处理优化<br>
                    有折扣额的发票详细清单处理优化：<br/>
                    （1）发票详情界面不按折扣行单独合计<br/>
                    （2）生成出入库单和凭证按照折扣对应的货物或应税劳务名生成，不生成单独的折扣行。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image002.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3. 【银行对账单】增加银行导入模板<br/>
                    银行导入模板：吉林九台农村商业银行、中国银行上海分行、中国工商银行泉州分行、中国银行宿迁分行、中国工商银行成都分行<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181227_2">【凭证管理】增加复制功能</h3>
                <ul>
                  <li>（1）【按月复制】：点击“按月复制”按钮，选择目标月份即可将数据复制到指定月；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image005.jpg')]"
                      lazy>
                    </el-image>
                    目标凭证日期取值：默认“对应日期（例：20170102发生的凭证复制到201702，凭证自动取1月业务发生的对应日期显示20170202）”；指定日期（将凭证复制到指定一天显示做账日期）<br/>
                  </li>
                  <li>
                    （2）【部分复制】：勾选凭证列表部分凭证，点击“复制”按钮，弹框选择目标日期即可完成部分复制；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    （3）【单张复制】：凭证表体，“复制”快捷图标；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image007.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181227_3">总账核算存货优化</h3>
                <ul>
                  <li>
                    增加存货匹配规则：存货名称+规格（型号）+计量单位（默认选项）；存货名称+计量单位<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image008.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image009.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_4">资产优化</h3>
                <ul>
                  <li>
                    新增“年限调整”功能，调整资产使用年限：调整后使用年限（月）必须大于“已计提折旧月份”，点击“计算”按钮，按调整后使用年限重新计算月折旧。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image010.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_5">结账办理-期末结转优化</h3>
                <ul>
                  <li>
                    小规模纳税人：增值税、附加税计提算法中增加代开专票、税控减免相关数据<br>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image011.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_6">账表优化</h3>
                <ul>
                  <li>
                    1.发生额余额表<br/>
                    （1）表头增加“显示辅助”快捷查询，开启后点击“显示辅助”会默认勾选科目启用全部辅助项<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image012.jpg')]"
                      lazy>
                    </el-image>
                    （2）打印增加适配“A5”纸<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image013.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2. 明细账查询优化<br/>
                    （1）增加单科目、多科目两种查询模式<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image014.jpg')]"
                      lazy>
                    </el-image>
                    （2）单科目查询模式下，科目显示在表头<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image015.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_7">增加核定征收企业所得税和生成经营个人所得税的相关功能</h3>
                <ul>
                  <li>1.支持小企业会计准则的核定征收功能<br/>
                    本版支持会计准则为“小企业会计准则”的客户指定征收方式为：核定征收<br/>
                  </li>
                  <li>
                    2.有限公司类型：核定征收--企业所得税：“核定应税所得率--按收入总额计算应纳税所得额<br/>
                    (1)【企业信息】增加征收方式调整的功能，修改征收方式；所得税类型是企业所得税；生效期间是税局核定的期间；应税所得率：按照税务机关核定的应税所得率填写<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image016.jpg')]"
                      lazy>
                    </el-image>
                    (2)【期末结转】增加企业所得税-核定征收，计提所得税费用算法<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image017.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image018.jpg')]"
                      lazy>
                    </el-image>
                    (3)【纳税申报】企业所得税B类报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3.增加个体工商户；个人独资企业；承包、承租经营者：核定征收、查账征收--生产经营个人所得税：“核定应税所得率--按收入总额计算应纳税所得<br/>
                    (1)【企业信息】增加征收方式调整的功能，选择公司类型是个体工商户；个人独资企业；承包、承租经营者；所得税类型是个人所得税生产经营所得；生效期间是税局核定的期间；应税所得率：按照税务机关核定的应税所得率填写<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image020.jpg')]"
                      lazy>
                    </el-image>
                    可改为：查账征收；开始生产经营日期手工输入<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image021.jpg')]"
                      lazy>
                    </el-image>
                    （2）【期末结转】增加个人所得税-核定征收、查账征收，计提所得税费用算法<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image022.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image023.jpg')]"
                      lazy>
                    </el-image>
                    （3）【纳税申报】个人所得税生产经营所得纳税申报表（A表）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image024.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image024.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_8">财务报表导出税局模式，增加浙江、青岛地区</h3>
                <ul>
                  <li>
                    从资产负债表节点导出财务报表月或季报（包括资产负债表、利润表、现金流量表）税局要求的文件格式，登录税局网站直接导入，生成财务报表申报表<br/>
                    1.支持浙江地区<br/>
                    浙江地区目前支持小企业财务报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image025.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image025.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image026.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image026.jpg')]"
                      lazy>
                    </el-image>
                    登录浙江财务报表转换工具—财税数据互通<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image027.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image027.jpg')]"
                      lazy>
                    </el-image>
                    导入文件保存之后，上传至电子税局<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image028.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image028.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image029.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image029.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2.支持青岛地区<br/>
                    青岛地区目前支持小企业财务报表（对应小企业会计准则）、一般企业财务报表（对应企业会计准则）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image030.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image030.jpg')]"
                      lazy>
                    </el-image>
                    导入青岛税局，上传文件后<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image031.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image031.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_9">纳税申报表优化</h3>
                <ul>
                  <li>1.所有地区增加个人所得税生产经营所得纳税申报表（A表）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image032.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image032.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2.江苏地区<br/>
                    (1)公司有发生出口退税业务，一般纳税人申报增值税，需要增加5张相关的报表，如下图所示<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image033.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image033.jpg')]"
                      lazy>
                    </el-image>
                    （2）增加环境保护税（A表）、城镇土地使用税的报表预制<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image034.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image034.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    3.修改企业所得税B类报表<br/>
                    小企业会计准则下修改企业所得税B类报表；核定征收—应税所得率---企业所得税B类表取值<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image035.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image035.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image036.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image036.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_10">报税客户端优化功能--1月初客户端上线</h3>
                <ul>
                  <li>1.江苏地区<br/>
                    （1）印花税、工会经费的申报表的征收项目，可直接通过客户端【获取局端数据】节点，获取本公司需要申报的相关信息；右侧点击申报表，打开查看明细<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image037.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image037.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image038.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image038.jpg')]"
                      lazy>
                    </el-image>
                    （2）批量打印支选择申报成功的明细报表打印<br>
                  </li>
                  <li>
                    2.北京、江苏地区支持个人所得税生产所得纳税申报表申报<br/>
                  </li>
                  <li>
                    3.优化山东地区地税申报功能
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181227_11">基础设置优化</h3>
                <ul>
                  <li> 1.会计科目优化
                    （1）会计科目增加“全部”页签，显示全部科目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image039.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image039.jpg')]"
                      lazy>
                    </el-image>
                    （2）新增银行科目支持快捷增加“银行账户”功能<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image040.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image040.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2.原“个性化设置”与“参数设置”节点合并为一个功能<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181227/image041.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181227/image041.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2018 12 27 end-->
        <!--2018 11 29 begin-->
        <li class="layui-timeline-item">
          <a name="V5.181129"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.181129&nbsp;&nbsp;<span class="layui-badge-rim">2018-11-29</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5181129_1">【企业信息】增加启用库存和资产模块功能</h3>
                <ul>
                  <li>1.
                    【企业信息】分为基本信息、纳税信息、建账信息三部分，基本信息在原信息基础上增加原管理平台-【我的客户】-【工商信息】-“经营范围”字段，纳税信息增加原【纳税信息】中“报税地区”、“纳税人识别号”、“征收方式”、“会计政策”、“城建税税率”五个字段<br>
                  </li>
                  <li>
                    2. 【企业信息】增加功能，已启用时，启用按钮隐藏，停用按钮显示；启用后系统处理规则按新的启用核算方式处理，旧数据保持不变<br>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image001.jpg')]"
                      lazy>
                    </el-image>
                    已启用<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181129_2">合并摘要生成规则</h3>
                <ul>
                  <li>合并规则设置中增加“摘要生成规则”，有“自动汇总”、“手工填制”两个单选选项，默认“自动汇总”<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image003.jpg')]"
                      lazy>
                    </el-image>
                    自动汇总：合并凭证上各分录的摘要汇总原凭证对应分录行摘要（多于200个汉字时截断）<br/>
                    手工填制：合并凭证生成后，弹出提示信息中增加摘要输入框，多行显示，支持上下滑动查看；<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181129_3">删除合并后的凭证，图片自动拆分</h3>
                <ul>
                  <li>
                    通过【上传图片】生成的凭证进行了合并处理，合并后凭证删除后系统自动拆分该张凭证包含图片，拆分至图片上传时的原始状态<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image005.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_4">凭证管理界面优化</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image007.jpg')]"
                      lazy>
                    </el-image>
                    增加时间轴快速查询功能<br>
                    凭证展示优化<br>
                    增加按摘要快速过滤凭证功能<br>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_5">凭证录入新增科目及辅助在当前页面处理，不跳转新页面</h3>
                <ul>
                  <li>
                    1.填制凭证-新增科目<br>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image008.jpg')]"
                      lazy>
                    </el-image>
                    2.辅助核算（以客户/供应商辅助档案为例）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image009.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_6">凭证录入辅助核算检索功能优化</h3>
                <ul>
                  <li>
                    1.“常用”勾选框字段名称变更为“辅助检索”<br/>
                    2.增加开启关闭按钮，默认开启
                    <el-image
                      :src="require('@/assets/changelog/20181129/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image010.jpg')]"
                      lazy>
                    </el-image>
                    3.增加取消辅助检索按钮
                    <el-image
                      :src="require('@/assets/changelog/20181129/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image011.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_7">外币凭证校验增加容错机制</h3>
                <ul>
                  <li>当外币业务单据上折算的人民币与系统根据原币*外币汇率计算出的人民币有小数位差额时，允许手工调整，当调整范围为【-0.1，0.1】时，该凭证能正常保存<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_8">进销项清单及银行对账单凭证合并规则优化</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image012.jpg')]"
                      lazy>
                    </el-image>
                    单据生成凭证分单规则及分录合并规则，摘要生成规则<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_9">基础设置中的资产类别及资产科目对照并到资产模块下</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image013.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_10">其他应付款科目细化</h3>
                <ul>
                  <li>（1）小会计会计准则、企业会计准则、企业会计制度：其他应付款增加下级科目<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image014.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image015.jpg')]"
                      lazy>
                    </el-image>
                    发版后使用上述三种准则（制度）新建账账套的，默认有此科目结构<br>
                    发版前已建账的账套，如果需要升级成此科目结构，打开【在线会计-总账-数据维护-标准科目】进行升级（指定历史数据升到哪个下级科目中，具体有科目升级操作文档）<br/>
                    【工资管理-入账设置】：发放工资个人扣款部分修正为上述“其他应付款”对应科目。<br>
                    （2）将原社保个人部分设置拆分为“个人养老保险科目”、“个人医疗保险科目”、“个人失业保险科目”三部分分别设置<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image016.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_11">库存模块功能优化</h3>
                <ul>
                  <li>
                    （1）入库单增加发票类型及相关处理<br/>
                    （2）领料出库时，单价和成本取采购价，不需手录，自动带出<br/>
                    （3）存货支持批量修改<br/>
                    （4）库存成本表：结存单价修改为实际结存单价<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_12">在线会计其他优化点</h3>
                <ul>
                  <li>
                    1.【凭证管理】节点：选中凭证点击反记账操作完成后，选中标识不清空，可以继续对该批凭证作其他操作<br/>
                    2.【凭证管理】节点：A4两版或A4三版模板凭证打印设置增加虚线设置；凭证打印设置增加行数设置<br/>
                    3.【发生额余额表】节点：当本年累计借贷方合计不平时，本年累计发生额旁显示提示图标，点击图标浮窗显示提示信息不平原因及解决办法：“勾选“有余额无发生不显示”或“无余额无发生不显示”可能会导致非查询期间数据不纳入所致本年累计借贷合计不相等（系统是没问题的）<br/>
                    4.【工资管理-工资表】：工资表打印增加A5纸模板及打印时是否打印制表人可设置<br/>
                    5.【会计科目】及【科目期初】增加科目搜索和是否显示封存科目功能<br/>
                    6.【会计科目】节点中增加快捷打开“科目期初”及“外币汇率”节点的功能<br/>
                    7. 外币汇率】表达方式优化<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image017.jpg')]"
                      lazy>
                    </el-image>
                    8.【会计科目】节点已使用的科目中间启用辅助核算的处理优化（先【增加】下级科目再操作【科目下级转辅助】或先通过做凭证将余额转到其他科目，启用辅助后再通过凭证转回来）<br/>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_13">优化一般纳税人进项一键取票</h3>
                <ul>
                  <li>首次取票下载安装【进项税发票管理软件】输入纳税人识别号、税盘口令，点击确定取票<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image018.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_14">纳税申报优化</h3>
                <ul>
                  <li>1、修改山东地区小规模附加税计税依据，取小规模增值税主表应纳税额合计<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image020.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image021.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2、江苏地区增加工费经费表的季报属期，个人所得税生产经营所得纳税申报表（A表）增加月报属期<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image022.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181129_15">一键报税客户端优化点</h3>
                <ul>
                  <li>1、客户端右侧报表列表，打开申报表跳转到在线会计的详情页<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image023.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image024.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image024.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181129/image025.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image025.jpg')]"
                      lazy>
                    </el-image>
                    2、纳税信息节点支持批量设置密码
                    <el-image
                      :src="require('@/assets/changelog/20181129/image026.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181129/image026.jpg')]"
                      lazy>
                    </el-image>
                    3、优化江苏、山东、重庆快捷登录、查询税种状态<br/>
                    4、优化个税申报查询状态，在本机申报成功的个税查询状态显示绿色，不在本机申报查询状态是灰色的<br/>
                    5、优化左侧公司列表，使用机柜报税时，插上证书的公司，在一键报税客户端左侧列表置顶显示<br/>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2018 11 29 end-->

        <!--2018 11 01 begin-->
        <li class="layui-timeline-item">
          <a name="V5.181101"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.181101&nbsp;&nbsp;<span class="layui-badge-rim">2018-11-01</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5181101_1">凭证管理增加“合并规则”功能</h3>
                <ul>
                  <li>1. 点击【凭证管理】-【凭证管理】-【更多】-【合并规则】进行凭证合并规则设置<br>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2. 根据业务需求进行勾选<br>
                    &nbsp;&nbsp;1) 凭证合并规则：两个选项二选一<br>
                    &nbsp;&nbsp;&nbsp;&nbsp; 按往来单位分别生成凭证：同一个往来单位合并生成一张凭证，不同往来单位分别生成凭证<br>
                    &nbsp;&nbsp;&nbsp;&nbsp; 勾选凭证生成一张凭证：将客户手动勾选的若干张凭证合并生成一张凭证<br>
                    &nbsp;&nbsp;2) 相同科目分录合并规则：二选一<br>
                    &nbsp;&nbsp;&nbsp;&nbsp; 同方向分录合并：同一个科目全部在借方的合并，全部在贷方的合并，不同方向不合并。<br>
                    &nbsp;&nbsp;&nbsp;&nbsp; 同方向，不同方向分录均合并：同一个科目分别在借贷方的全部合并成一条分录。<br>
                    &nbsp;&nbsp;&nbsp;&nbsp; 银行科目不合并：复选，选中后，银行科目不合并。<br>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181101_2">凭证管理增加“打印设置”功能</h3>
                <ul>
                  <li>点击【凭证管理】-【凭证管理】-【更多】-【打印设置】进行凭证打印设置，可勾选多家公司统一进行打印设置，设置后，切换到其他公司（在【打印设置】中已勾选的公司）不必重新设置。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5181101_3">填制凭证辅助项支持模糊检索</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_4">填制凭证科目数量显示</h3>
                <ul>
                  <li>1.【基础设置】-【个性化设置】中选择“制单时显示科目数量”参数为显示，点击“保存”；<br>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    2.填制凭证时录入会计科目及相应辅助，系统自动显示科目余额，若该科目在【基础设置】-【会计科目】节点已勾选数量核算，系统自动显示科目余额及数量余额，并根据本次录入数据同步变更。<br>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image005.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_5">填制凭证节点优化小规模自开或代开专票税目</h3>
                <ul>
                  <li>
                    小规模纳税人有发生自开或代开专票业务，填制凭证节点选则相应的税目；例如发生专票3%服务业务选择：自开或税务机关代开增值税专用发票不含税销售额3%征收率服务、不动产和无形资产<br>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_6">新增银行对账单模板</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image007.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_7">银行对账单新增“期间调整”按钮</h3>
                <ul>
                  <li>点击【票据管理】-【银行对账单】-【期间调整】进行入账期间选择。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_8">进项发票导入</h3>
                <ul>
                  <li>
                    增值税进项发票可选择从确认平台导出，然后导入大账房进项发票，形成发票清单<br>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image009.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image010.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image011.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_9">销项发票一键取票</h3>
                <ul>
                  <li>通过纳税人识别号、绑定码一键获取销项数据<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image012.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image013.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_10">科目明细账增加“打印封皮”功能</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image014.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_11">期末结转增加“反期末调汇”按钮</h3>
                <ul>
                  <li>点击【结账办理】-【期末结转】-【反期末调汇】对已结转汇兑损益的凭证进行反结转。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image015.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_12">启用外币的会计科目增加“不汇兑调整”功能项</h3>
                <ul>
                  <li>点击【基础设置】-【会计科目】-选择会计科目-【修改】-【外汇核算】-【不汇兑调整】，可对已启用外币核算的科目进行期末不做汇兑调整的设置(例如：实收资本）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image016.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_13">期末关账检查新增“自动整理”功能</h3>
                <ul>
                  <li>点击【结账办理】-【关账检查】-【凭证是否断号】-【自动整理】系统会按凭证号顺次前移补齐断号。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image017.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_14">出库单增加“发票类型”选项，生成凭证根据选择的发票类型生成凭证</h3>
                <ul>
                  <li>1、通过【出库单】转总账生成凭证需手动选择发票类型；<br/>
                  </li>
                  <li>
                    2、通过【总账】中【销项发票】生成出库，系统自动生成【出库单】发票类型，不需手动选择发票类型。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image018.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_15">总账核算存货新增“毛利率统计表”</h3>
                <ul>
                  <li>【存货管理】-【毛利率统计表】<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5181101_16">新增在线教学视频功能（加盟商）</h3>
                <ul>
                  <li>点击【教学视频】-相关应用视频，可播放操作流程教学视频<br/>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image020.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20181101/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20181101/image021.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!--2018 11 01 end-->
        <li class="layui-timeline-item">
          <a name="V5.180927"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180927&nbsp;&nbsp;<span class="layui-badge-rim">2018-09-27</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5180927_1">存货参照增加“规格（型号）”显示</h3>
                <ul>
                  <li>（1）科目期初--存货辅助期初录入：存货档案参照增加“规格（型号）”显示<br>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image001.jpg')]"
                      lazy>
                    </el-image>
                    （2）填制凭证：存货辅助参照增加“规格（型号）”显示<br>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180927_2">科目期初--辅助期初支持“导入”功能（除职员辅助）</h3>
                <ul>
                  <li>（1）如存货辅助导入：辅助期初增加“导入”功能，“点击下载”系统将已录入的存货期初数据导出，客户可以在此基础上修改或新增（新增的存货会同步到存货档案）。<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>（2）客户、供应商、项目、部门辅助期初增加“导入”功能，“点击下载”系统将已录入的辅助期初数据导出，客户可以在此基础上修改或新增（新增的辅助项会同步到对应的辅助核算档案中）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180927_3">启用“库存管理”模块，支持一次生成暂估单</h3>
                <ul>
                  <li>（1）期末成本结转暂估提示<br>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image005.jpg')]"
                      lazy>
                    </el-image>
                    （2）入库单节点：增加“暂估”功能按钮，弹框系统过滤出所有为负库存的存货，用户可手工修改暂估数量、暂估单价、暂估金额<br>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image006.jpg')]"
                      lazy>
                    </el-image>
                    （3）入库单：查询条件增加“是否暂估”查询条件<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image007.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_4">新增支持河南新乡地区百旺导入销项发票</h3>
              </li>

              <li>
                <h3 id="v5180927_5">发生额余额表和科目明细账打印优化</h3>
                <ul>
                  <li>打印数据过长，自动缩小字体取消，折行显示<br>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_6">成本结转后出库单单价和金额体现成本价</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image009.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image010.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_7">发票上有折扣行的生成的出入库单及凭证优化</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image011.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image012.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_8">成本结转“先进先出”选项隐藏，成本结转暂支持“全月加权法”</h3>
              </li>

              <li>
                <h3 id="v5180927_9">填制凭证新增科目时，带出上级科目编码</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image013.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image014.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_10">工资表支持自动按月复制</h3>
                <ul>
                  <li>工资表增加“开关”图标，开启后，系统自动复制最近一个月的工资表到查询月
                    例如9月份工资有数据；切换日期到11月后，自动复制9月份工资到11月<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image015.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image016.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image017.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180927_11">纳税申报</h3>
                <ul>
                  <li>一般人增值税税表新增农产品相关报表<br/>
                    （1）纳税信息维护节点，增值税一般纳税人申报表月报，勾选农产品5张申报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image018.jpg')]"
                      lazy>
                    </el-image>
                    （2）纳税填报节点，打开增值税明细表，查看新增的农产品报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    江苏地区增加两张报表<br/>
                    （1）纳税信息维护节点，江苏地区，勾选个人所得税生产经营所得纳税申报表（A表）、
                    地方各项基金费（工会经费、垃圾处理费）申报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image020.jpg')]"
                      lazy>
                    </el-image>
                    （2）个人所得税生产经营所得纳税申报表（A表）<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image021.jpg')]"
                      lazy>
                    </el-image>
                    （3）地方各项基金费（工会经费、垃圾处理费）申报表<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image022.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    附加税申报表，城建税税率自动取值<br/>
                    （1）纳税信息维护节点，城建税税率默认是7%，可手工修改<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image023.jpg')]"
                      lazy>
                    </el-image>
                    （2）附加税城建税税率<br/>
                    <el-image
                      :src="require('@/assets/changelog/20180927/image024.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180927/image024.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <!--2018-09-27-->
        <li class="layui-timeline-item">
          <a name="V5.180912"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180912&nbsp;&nbsp;<span class="layui-badge-rim">2018-09-12</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5180912_1">个税起征点上调至5000！</h3>
                <ul>
                  <li>对纳税人在2018年10月1日（含）后实际取得的工资、薪金所得，减除费用统一按照5000元/月执行，并按照本通知所附个人所得税税率表一计算应纳税额、个税。
                    <br>
                    （1）政策变更前，应发工资扣除3500后，个人所得税如下<br>
                    <el-image
                      :src="require('@/assets/changelog/20180912/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180912/image001.jpg')]"
                      lazy>
                    </el-image>
                    （2）政策变更后，应发工资扣除5000后，个人所得税如下<br>
                    <el-image
                      :src="require('@/assets/changelog/20180912/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180912/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180912_2">工资表支持河南、河北、重庆个税导入！</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180912/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180912/image003.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180912_3">总账核算存货支持期初数据！</h3>
                <ul>
                  <li>（1）存货管理增加“存货期初”节点，设置存货启用期间，根据启用期间进行存货数据同步或导入。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180912/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180912/image004.jpg')]"
                      lazy>
                    </el-image>
                    （2）根据存货启用期间同步存货对应科目数据<br>
                    <el-image
                      :src="require('@/assets/changelog/20180912/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180912/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <!-- ********************************* -->
        <li class="layui-timeline-item">
          <a name="V5.180905"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180905&nbsp;&nbsp;<span class="layui-badge-rim">2018-09-05</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="v5180905_1">支持总账存货核算</h3>
                <ul>
                  <li>建账新增“总账核算存货”选项，根据业务需要进行选择<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>在线端库存设置选择对应的存货核算方式<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>扫票或导入的进项、销项数据进行存货匹配生成总账凭证和出入库单据<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image003.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>期末成本结转<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image005.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>查看成本表和库存明细账<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image007.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>打印出入库单<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image009.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_2">图片信息增加修改功能</h3>
                <ul>
                  <li>图片信息增加“修改”按钮，可对暂存态图片信息进行修改和补充。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image010.jpg')]"
                      lazy>
                    </el-image>
                    保存后通过“识别”按钮重新生成凭证。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image011.jpg')]"
                      lazy>
                    </el-image>
                    通过图片联查凭证。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image012.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_3">凭证支持模糊检索辅助项目</h3>
                <ul>
                  <li>科目设置辅助项目。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image013.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>填制凭证，模糊检索客户辅助。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image014.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_4">企业所得税根据地区差异支持按月计提</h3>
                <ul>
                  <li>参数设置计提所得税可以选择“月度”计提。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image015.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>期末处理，计提所得税。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image016.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_5">银行对账单优化</h3>
                <ul>
                  <li>增加银行导入模板：民生银行账单模板、青岛银行农商银行、交通银行、渤海银行、招商银行杭州分行、中国银行宿迁分行、青岛地区兴业银行.<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image017.jpg')]"
                      lazy>
                    </el-image>
                    导入数据，根据摘要匹配入账模板生成凭证<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image018.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>银行账户支持快捷修改。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image020.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_6">预警预制小规模免增值税收入预警</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image021.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image022.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_7">凭证支持多来源合并</h3>
                <ul>
                  <li>凭证管理支持进项、销项、银行对账单、出入库单据凭证合并。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image023.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image024.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image024.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_8">登录显示密码</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image025.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image025.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_9">工资管理-工资表</h3>
                <ul>
                  <li>个税导入支持的地区：北京、江苏、山东、重庆、福建，本版增加广西、海南地区的申报表导入<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image026.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image026.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image027.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image027.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image028.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image028.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="v5180905_10">纳税申报</h3>
                <ul>
                  <li>
                    增值税表预制<br>
                    （1）根据关于增值税税控系统专用设备和技术维护费用抵减增值税税额的政策，支持一般人、小规模增值税申报表取数；纳税人有发生该项业务税额抵减时，填写在应纳税额减征额对应的行次<br>
                    （2）凭证处理<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image029.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image029.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image030.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image030.jpg')]"
                      lazy>
                    </el-image>
                    （3）一般人增值税主表<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image031.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image031.jpg')]"
                      lazy>
                    </el-image>
                    （4）小规模增值税主表<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image032.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image032.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>企业会计制度财报申报<br>
                    （1）江苏、重庆地区支持企业会计制度财报月、季申报<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image033.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image033.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image034.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image034.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    纳税申报--财务报表支持编辑修改<br>
                    山东、重庆、江苏、北京以及其他地区财报编辑修改<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image035.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image035.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3 id="v5180905_11">财务报表支持导出tax格式并导入深圳税局</h3>
                <ul>
                  <li>（1）在线会计-资产负债表导出点击【导出】选择导出tax格式，目前支持小企业财报（小企业会计准则）、一般企业财报（企业会计准则）的月季tax格式导出<br>
                    备注：导出tax格式文件包含资产负债表、利润表和现金流量表,可直接导入深圳税局系统；支持按月、季导出，导出季报时请切换到3、6、9、12月份
                    <el-image
                      :src="require('@/assets/changelog/20180905/image036.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image036.jpg')]"
                      lazy>
                    </el-image>
                    （2）登录深圳税局报税网站，选择财报报表申报，目前支持小企业财报（小企业会计准则）、一般企业财报（企业会计准则）的导入<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image037.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image037.jpg')]"
                      lazy>
                    </el-image>
                    （3）点击【导入申报表】，从在线会计导出的tax格式，不做任何修改，即可导入，如下图所示：<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image038.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image038.jpg')]"
                      lazy>
                    </el-image>
                    （4）导入成功之后，确认申报数据无误，点击【确认发送】，申报财报<br>
                    <el-image
                      :src="require('@/assets/changelog/20180905/image039.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180905/image039.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <!-- ************************ -->

        <li class="layui-timeline-item">
          <a name="V5.180726"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180726&nbsp;&nbsp;<span class="layui-badge-rim">2018-07-26</span></h2>
            </div>
            <ul>
              <li>
                <h3 id="V5180726_1">支持企业会计制度</h3>
                <p>本版本预制了企业会计制度的会计科目、资产负债表、利润表、期末处理。</p>
                <ul>
                  <li>建账支持选择“企业会计制度”<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image001.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image001.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>支持采用“企业会计制度”会计科目入账<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image002.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image002.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>支持企业会计制度相关报表:资产负债表、利润表，并形成相关纳税申报表<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image003.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image003.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image004.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image004.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>支持企业会计制度相关期末处理<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image005.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image005.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_2">图片支持“识别”操作</h3>
                <ul>
                  <li>图片浏览“已制证票据”界面勾选票据，点击“识别”，可对“票据图片”进行识别制单。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image006.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image006.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>凭证界面，点击“识别”可对“票据图片”进行识别制单。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image007.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image007.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_3">进项发票、销项发票、银行对账单功能优化</h3>
                <ul>
                  <li>合并规则支持：相同期间科目合并、相同期间科目合并，银行科目不合并、同期间合并（科目不合并）。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image008.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image008.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>银行对账单支持与银行回单自动对账<br>状态栏可以查看：银行对账单120笔，银行回单98笔，未收到22笔。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image009.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image009.jpg')]"
                      lazy>
                    </el-image>
                    点击“未收到回单”可查看未绑定“银行回单”对账单数据。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image010.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image010.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_4">附加税计提根据“纳税信息”节点维护的税率计提</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image011.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image011.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image012.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image012.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_5">收入预警支持按“月度、季度、年度、连续12月”组合预警</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image013.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image013.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image014.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image014.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_6">资产负债表不平提示差额及具体原因，查账更方便</h3>
                <ul>
                  <li>资产负债表不平提示差额及具体原因，点击查看连接到相应节点。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image015.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image015.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_7">财务报表支持税局tax格式导出，并导入到国税系统中，直接申报，减少手工录入</h3>
                <ul>
                  <li>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image016.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image016.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_8">一般纳税人测算税额更完善</h3>
                <ul>
                  <li>税收测算节点增加“待认证抵扣税额”，未认证的票据金额累计会到“待认证抵扣税额”<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image017.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image017.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_9">总账推库存模式功能优化</h3>
                <ul>
                  <li>存货支持快捷新增“存货类别”和“计量单位”<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image018.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image018.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image019.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image019.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3 id="V5180726_10">纳税申报</h3>
                <ul>
                  <li>
                    北京地区增加小规模月报表申报<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image020.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image020.jpg')]"
                      lazy>
                    </el-image>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image021.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image021.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>纳税信息优化<br>
                    （1）纳税信息维护节点，默认打开是当前公司的详情页；可返回至列表界面<br>
                    （2）增加3个字段：法定代表人、法人电话、期末从业人数<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image022.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image022.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>
                    客户端支持批量维护公司纳税信息，可同步到在线会计端纳税信息节点<br>
                    <el-image
                      :src="require('@/assets/changelog/20180726/image023.jpg')"
                      :preview-src-list="[require('@/assets/changelog//20180726/image023.jpg')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <a name="V5.180627"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180627&nbsp;&nbsp;<span class="layui-badge-rim">2018-06-27</span></h2>
            </div>
            <ul>
              <li>
                <h3>银行对账单新增5家银行导入</h3>
                <ul>
                  <li>新增银行类型：重庆农村商业银行、中国农业银行苏州分行、苏州银行、中国建设银行、中国建设银行苏州分行。<br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>智能识别显示图片识别信息</h3>
                <ul>
                  <li>在图片浏览、填制凭证显示图片识别结果，对于智能生成凭证正确性检查更方便。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>支持数量、单价、汇率精度自定义设置</h3>
                <ul>
                  <li>参数设置—设置数量、单价、汇率精度。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>填制凭证时数量、单价、汇率的精度会根据预先设置展示。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>凭证合并</h3>
                <ul>
                  <li>智能识别的凭证和手工录入的凭证合并。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>支持村集体组织核算</h3>
                <ul>
                  <li>会计科目方案增加农村集体经济组织。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>存货导入自动新增存货类别、计量单位项目</h3>
                <ul>
                  <li>库存管理模块导入存货数据，自动根据导入存货数据新增存货类别、计量单位项目。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>存货成本表支持负库存调整</h3>
                <ul>
                  <li>库存成本表新增调整库存按钮，根据账务需要进行库存调整（总账凭证生成存货单据）。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>选择需要调整的存货点击调整库存，系统自动联查到凭证管理节点，展示该存货相关凭证数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>凭证界面显示存货结存数量，调整凭证后保存即可。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180627/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20180627/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <a name="V5.180525"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180525&nbsp;&nbsp;<span class="layui-badge-rim">2018-05-25</span></h2>
            </div>
            <ul>
              <li>
                <h3>销项发票自由匹配存货</h3>
                <ul>
                  <li>票据管理-销项发票，勾选列表数据点击“生成出库”按钮，销售发出的商品自动与存货进行出库匹配。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>销项发票开出的“货物或应税劳务”与存货辅助不一致时，弹出“出库匹配存货”弹框，由用户指定发出存货，点击保存后，系统自动按照已匹配存货发出商品生成出库单据及凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>生成出库单并联查出库凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>存货备注中可查看已匹配开票项目。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>智能识别生成的凭证支持合并</h3>
                <ul>
                  <li>勾选需要合并的凭证，点击“凭证合并”按钮进行合并。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>凭证合并成功点击“凭证号”联查凭证明细。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>智能识别自动生成下级</h3>
                <ul>
                  <li>智能识别生成凭证，如果科目使用下级明细核算，系统自动根据下级明细进行匹配，无匹配对象时根据识别的信息自动新增下级。</li>
                  <li>举例：下图为“收到往来款”回单，“应收账款”下级没有对应客户名称时，系统自动根据银行回单付款方名称新增“重庆市万州区善荣建材有限公司”下级明细生成凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180525/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20180525/image015.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <a name="V5.180417"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180417&nbsp;&nbsp;<span class="layui-badge-rim">2018-04-17</span></h2>
            </div>
            <ul>
              <li>
                <h3>科目下级一键转辅助</h3>
                <ul>
                  <li>选择所要转辅助的上级科目，点击“科目下级转辅助”的按钮，进行操作。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>根据用户所选择的“待选科目”自动匹配“辅助项目”，点击“确认”即可将1405科目下级转入“存货”辅助核算。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>在账表中可以查询到辅助明细数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>支持劳务、外籍人员的个税导入和申报</h3>
                <ul>
                  <li>金三系统劳务报酬、外籍人员信息分别导入大账房工资表。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>工资表维护数据后可通过，“更多操作”导出纳税申报表，进行个税申报。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>不启用库存的商贸成本结转可以带出发出数量</h3>
                <ul>
                  <li>“结转期末销售成本”时，自动根据销售凭证带出发出数量，点击“生成凭证”即可。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>生成“成本结转”凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
              <li>
                <h3>进项、销项自动生成出、入库单</h3>
                <ul>
                  <li>获取的采购或销售发票数据自动入账。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image015.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>“一键取票”过来的销售或采购数据自动带入出入库节点并生成总账凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>智能识别票据，支持批量审核、记账</h3>
                <ul>
                  <li>“凭证管理”可以对已识别的凭证进行批量审核、记账。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180417/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20180417/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <a name="V5.180319"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180319&nbsp;&nbsp;<span class="layui-badge-rim">2018-03-19</span></h2>
            </div>
            <ul>
              <li>
                <h3>进项发票生成入库</h3>
                <ul>
                  <li>票据管理-进项发票，勾选进项发票选择“生成入库”按钮，进项发票自动生成入库单据及总账凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>库存管理-入库单，查看进项发票入库数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>通过入库单或进项发票节点联查凭证数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>销项发票生成出库</h3>
                <ul>
                  <li>票据管理-销项发票，勾选销项发票选择“生成出库”按钮，销项发票自动生成出库单据及总账凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>库存管理-出库单，查看销项发票出库数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image009.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image009.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>通过出库单或销项发票节点联查凭证数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image011.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image011.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>新增风控体检，帮助企业提早进行风险防范与应对</h3>
                <ul>
                  <li>财务账簿-风控体检，点击“立即体检”后查看报告。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image013.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image013.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>丰富多彩的风控指标。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image015.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image015.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>查看指标详情。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image017.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image017.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>计提所得税能享受的税收优惠</h3>
                <ul>
                  <li>期末处理-弥补以前年度亏损。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image019.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image019.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>计提所得税。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image021.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image021.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>系统自动按照弥补亏损后的利润总额计算优惠税率生成计提凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image023.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image023.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>凭证支持合并</h3>
                <ul>
                  <li>凭证管理，勾选需要合并的凭证数据，点击“凭证合并”。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image025.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image025.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>系统自动合并为一张凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image027.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image027.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>纳税申报优化</h3>
                <ul>
                  <li>纳税信息-纳税申报表维护。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image029.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image029.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>纳税填报，列示本期需要申报的报表。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image031.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image031.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>编写申报表。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180319/image033.png')"
                      :preview-src-list="[require('@/assets/changelog//20180319/image033.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>一键报税</h3>
                <ul>
                  <li>北京地区实现地税印花税申批量报。
                  </li>
                  <li>江苏地区实现国税（增值税、企业所得税、财报）、地税（附加税、个税、印花税）批量申报。
                  </li>
                  <li>开通山东地区小规模、一般人国税（增值税、企业所得税、财报）、地税（附加税、个税、印花税）批量申报。
                  </li>
                </ul>
              </li>

            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <a name="V5.180123"></a>
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">
              <h2>V5.180123&nbsp;&nbsp;<span class="layui-badge-rim">2018-01-23</span></h2>
            </div>
            <ul>
              <li>
                <h3>小规模增值税、附加税按月结转</h3>
                <ul>
                  <li>基础设置-参数设置，选择小规模“月度”结转。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image001.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image001.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>凭证管理录入日常业务。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>根据小规模所享受的优惠政策，期末自动结转“增值税、附加税”凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image005.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image005.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>小规模增值税、附加税按季结转</h3>
                <ul>
                  <li>基础设置-参数设置，选择小规模“季度”结转。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image007.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image007.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>凭证管理录入日常业务。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image003.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image003.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>根据小规模所享受的优惠政策，期末自动结转“增值税、附加税”凭证。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image010.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image010.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>进项、销项及银行对账单支持多种合并规则</h3>
                <ul>
                  <li>举例：打开进项节点，选择数据导入后，列表显示明细数据。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image012.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image012.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>选择凭证生单“合并规则”。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image014.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image014.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>选择数据点击“生成凭证”。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image016.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image016.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>批量打印让凭证、账表打印更加省时、省力</h3>
                <ul>
                  <li>会计工厂-批量打印，新增凭证打印，支持多家客户打印设置及下载。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image018.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image018.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>打印任务状态变成“已生成”时，可勾选单家或多家进行“批量下载”。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image020.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image020.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>下载完成后，状态自动返回打印装订节点。
                  </li>
                </ul>
              </li>

              <li>
                <h3>一键取票更加智能，解放会计双手不在话下</h3>
                <ul>
                  <li>销项、进项发票节点，点击“一键取票”后自动生单。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image022.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image022.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>纳税申报</h3>
                <ul>
                  <li>企业所得税年度汇算清缴（A类 , 2017年版）申报表自动生成。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image024.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image024.png')]"
                      lazy>
                    </el-image>
                  </li>
                  <li>北京企业所得税地税实现自动化申报。
                  </li>
                  <li>开通重庆地区小规模、一般人申报国税自动申报。
                  </li>
                </ul>
              </li>

              <li>
                <h3>优化纳税信息维护模块</h3>
                <ul>
                  <li>优化纳税信息维护模块，界面清晰，一目了然。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image026.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image026.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

              <li>
                <h3>优化北京客户端申报流程</h3>
                <ul>
                  <li>优化北京客户端申报流程。
                    <br>
                    <el-image
                      :src="require('@/assets/changelog/20180123/image028.png')"
                      :preview-src-list="[require('@/assets/changelog//20180123/image028.png')]"
                      lazy>
                    </el-image>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
        </li>

        <li class="layui-timeline-item">
          <i class="layui-timeline-axis"></i>
          <div class="layui-timeline-content layui-text">
            <div class="layui-timeline-title">...</div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped>
  .layui-timeline-axis {
    position: absolute;
    width: 15px;
    height: 15px;
    border: solid 1px #ddd;
    background-color: #fff;
    border-radius: 50%;
  }

  .layui-timeline-content {
    padding-left: 25px;
  }

  .layui-text {
    line-height: 22px;
    font-size: 14px;
    color: #666;
  }

  .layui-text h2 {
    font-size: 24px;
    font-weight: 500;
    color: #333;
  }

  .layui-badge-rim {
    height: 18px;
    line-height: 18px;
    border-width: 1px;
    border-style: solid;
    background-color: #fff;
    color: #666;
    padding: 0 6px;
    font-size: 12px;
    border-color: #e6e6e6;
  }

  .layui-timeline-item {
    position: relative;
    padding-bottom: 20px;
  }

  .layui-timeline-title {
    position: relative;
    margin-bottom: 10px;
  }

  .layui-text ul {
    padding: 5px 0 5px 15px;
  }

  .layui-text ul li {
    margin-top: 5px;
    list-style-type: disc;
  }

  li.layui-timeline-item {
    list-style: none;
  }

  .layui-timeline-item:before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    z-index: 0;
    width: 1px;
    height: 100%;
    background-color: #e6e6e6;
  }

  .layui-timeline-item:nth-child(1) .layui-timeline-title h2 {
    color: #ff5722;
  }

  >>> .el-image {
    width: 200px;
    height: 95px;
  }

  .nav-menu {
    position: absolute;
    top: 10px;
    right: 40px;
    z-index: 1;
    border: 1px solid #d2d2d2;
    max-height: 90%;
    overflow: auto;
  }

  .nav-menu-title {
    text-align: center;
    background: #F8F8F8;
    padding: 5px;
  }

  .nav-menu > ul {
    padding: 10px 10px 10px 20px;
  }

  .nav-menu > ul > li {
    margin-top: 5px;
    list-style-type: disc;
  }
  .nav-menu > ul > li > a {
    color: #01AAED;
    text-decoration: none;
  }
</style>
