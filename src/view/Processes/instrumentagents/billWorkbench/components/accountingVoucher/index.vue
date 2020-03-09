<template>
  <div style="width: 1048px">
    <table>
      <thead>
        <th>摘要</th>
        <th>会计科目</th>
        <th>借方金额</th>
        <th>贷方金额</th>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'accountingVoucher',
  data () {
    return {}
  }
}
</script>

<style scoped>
  table {
    border-collapse: collapse;
    border: 2px solid #666;
    margin: 0 auto;
  }
  table tbody td {
    width: 250px;
  }
</style>
