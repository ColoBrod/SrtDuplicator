const fs = require('fs')
const langs = ["af_ZA","ar_AR","ay_BO","az_AZ","be_BY","bg_BG","bn_IN","bs_BA","ca_ES","ck_US","cs_CZ","cx_PH","cy_GB","da_DK","de_DE","el_GR","en_GB","en_IN","en_US","eo_EO","es_CL","es_CO","es_ES","es_LA","es_MX","es_VE","et_EE","eu_ES","fa_IR","fi_FI","fo_FO","fr_CA","fr_FR","fy_NL","ga_IE","gl_ES","gn_PY","gu_IN","gx_GR","he_IL","hi_IN","hr_HR","hu_HU","hy_AM","id_ID","is_IS","it_IT","ja_JP","jv_ID","ka_GE","kk_KZ","km_KH","kn_IN","ko_KR","ku_TR","la_VA","li_NL","lt_LT","lv_LV","mg_MG","mk_MK","ml_IN","mn_MN","mr_IN","ms_MY","mt_MT","nb_NO","ne_NP","nl_BE","nl_NL","nn_NO","pa_IN","pl_PL","ps_AF","pt_BR","pt_PT","qu_PE","rm_CH","ro_RO","ru_RU","sa_IN","se_NO","sk_SK","sl_SI","so_SO","sq_AL","sr_RS","sv_SE","sw_KE","sy_SY","ta_IN","te_IN","tg_TJ","th_TH","tl_PH","tr_TR","tt_RU","uk_UA","ur_PK","uz_UZ","vi_VN","xh_ZA","yi_DE","zh_CN","zh_HK","zh_TW","zu_ZA"]
const sourceFile = process.argv[2]

const color = {
  green:  '\x1b[32m%s\x1b[0m',
  red:    '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m'
}

let res = sourceFile.match(/(.*?)\.?([a-z][a-z]_[A-Z][A-Z])?\.srt/)

if (!res) {
  console.log(color.red, "Sorry, source file should have .srt extension. The program will exit.")
  process.exit()
}

let sourcePath = res[0]
  , sourceName = res[1]
  , sourceLang = res[2]

if (!fs.existsSync(sourcePath)) {
  console.log(color.red, "Sorry, source file is not found. The program will exit.")
  process.exit()
}

let promises = []
for (let ln of langs) {
  if (sourceLang == ln) {
    console.log(color.yellow, `Original language - ${sourceLang}. Program is skipping this language.`)
    continue
  }
  if (fs.existsSync(`${sourceName}.${ln}.srt`)) {
    console.log(color.yellow, `File named ${sourceName}.${ln}.srt already exists. Skipping this itteration.`)
    continue
  }
  promises.push( copySrt(ln) )
}

Promise.all(promises)
  .then(() => console.log(color.yellow, 'Program exits.'))
  .catch(ln => console.log(color.red, `Couldn't copy to ${sourceName}.${ln}.srt`))

function copySrt(ln) {
  return new Promise(function(resolve, reject){
    fs.copyFile(sourcePath, `${sourceName}.${ln}.srt`, (err) => {
      if (err) reject(ln)
      console.log(color.green, `Copied to ${sourceName}.${ln}.srt`)
      resolve()
    })
  })
}
