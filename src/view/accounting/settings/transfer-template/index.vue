<template>
    <div class="app-main">
      <div class="kj-container">
        <ul class="link-ul">
          <router-link to="/cwcl/settings/cost-transfer-template">
            <li>
              <img src="@/assets/img/archive.png" alt="">
              <span>结转成本</span>
            </li>
          </router-link>
          <router-link to="/cwcl/settings/exchange-gains-and-losses-template">
            <li>
              <img src="@/assets/img/archive.png" alt="">
              <span>汇兑损益</span>
            </li>
          </router-link>
          <router-link to="/cwcl/settings/provision-surtax-template">
            <li>
              <img src="@/assets/img/archive.png" alt="">
              <span>计提附加税</span>
            </li>
          </router-link>
          <router-link to="/cwcl/settings/profit-loss-carryover-template">
            <li>
              <img src="@/assets/img/archive.png" alt="">
              <span>期间损益</span>
            </li>
          </router-link>
          <router-link to="/cwcl/settings/profit-carryover-template">
            <li>
              <img src="@/assets/img/archive.png" alt="">
              <span>利润结转</span>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: 'transfer-template'
}
</script>

<style scoped>
.link-ul {
  list-style: none;
}
.link-ul li {
  float: left;
  margin: 7% 0 0 12%;
  text-align: center;
  cursor: pointer;
}
.link-ul li img {
  width: 150px;
  display: block;
}
.link-ul li span {
  color: #1e8ad3;
  font-size: 16px;
  display: inline-block;
  margin-top: 20px;
}
</style>
