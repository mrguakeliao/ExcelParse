<template>
  <div class="parse-container">
    <el-form id="formRef" ref="formRef" :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-upload style="display:inline-block" ref="uploadDemo" :http-request="uploadFile"
                   accept=".xls,.xlsx"
                   :show-file-list="false" :auto-upload="true">
          <el-button icon="el-icon-upload2" size="small" type="primary">上传excel</el-button>
        </el-upload>
      </el-form-item>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="sheet in worksheets" :label=sheet.name :name=sheet.name :key="sheet.name">
          <el-button type="primary" @click="copyText(sheet)">复制</el-button>
          <VueJsonPretty class="pretty-container" :data="sheet" :height="800" virtual/>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
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
      activeName: ""
    }
  },
  mounted() {
  },
  methods: {
    copyText(sheet) {
      navigator.clipboard.writeText(JSON.stringify(sheet));
    },
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
      this.activeName = _.first(this.worksheets)?.name
      console.log(this.worksheets)
    }
  }
}
</script>
<style scoped>
.parse-container {
  height: 100%;
  width: 100%;
}

.pretty-container {
  border: 10px solid #eee;
}

:deep .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
