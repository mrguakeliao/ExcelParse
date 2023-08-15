<template>

  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-upload style="display:inline-block" ref="uploadDemo" :http-request="uploadFile"
                 accept=".xls,.xlsx"
                 :show-file-list="false" :auto-upload="true">
        <el-button icon="el-icon-upload2" size="small" type="primary">上传excel</el-button>
      </el-upload>
    </el-form-item>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="sheet in worksheets" :label=sheet.name :name=sheet.name :key="sheet.name">
        <VueJsonPretty :data="sheet"/>
      </el-tab-pane>
    </el-tabs>
  </el-form>

</template>

<script>
import ReadExcel from "@/utils/Parse.js";
import _ from "lodash";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  components: {
    VueJsonPretty
  },
  data() {
    return {
      worksheets: [
        // {
        //   name: "",
        //   merges: [],
        //   rows: [],
        // }
      ],

    }
  },
  computed: {
    activeName() {
      return _.first(this.worksheets)?.name ?? ""
    }
  },
  methods: {
    async uploadFile(form) {
      let data = await ReadExcel(form.file)
      let worksheets = data._worksheets.filter(item => item != null)
      this.worksheets = worksheets.reduce((cur, next) => {
        let sheet = {
          name: next.name,
          merges: Object.entries(next._merges).map(item => {
            // eslint-disable-next-line no-unused-vars
            let [_, value] = item
            return {
              startRow: value["top"],
              endRow: value["bottom"],
              startColumn: value["left"],
              endColumn: value["right"]
            }
          }),
          rows: next._rows.map(row => {
            let item = {}
            row._cells.forEach(cell => {
              let address = cell._address.replace(/[0-9]/g, "")
              let text = cell._value.model.value ?? ""
              if (text instanceof Object) {
                text = text?.richText?.reduce((cur, next) => {
                  return cur + next.text
                }, "");
              }
              item[address] = text;
            })
            return item
          })
        }
        cur.push(sheet)
        return cur;
      }, [])
      console.log(this.worksheets)
    }
  }
}
</script>
<style scoped>
:deep .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
