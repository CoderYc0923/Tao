<script setup lang="ts">
import type { UserInfo } from '@/typing'
import { solar2lunar } from '@/utils/configs/dateTransform'
import natalChart from '@/components/natalChart/index.vue'

const resultData = ref<any>()

const userInfo = ref<UserInfo>({
  name: '',
  birthdayYMD: [],
  birthdayHMS: [],
})

const ymdValue = computed(() => {
  return userInfo.value.birthdayYMD.join('-')
})

const hmsValue = computed(() => {
  return userInfo.value.birthdayHMS.join(':')
})

const showPicker = ref<boolean>(false)
const showTimer = ref<boolean>(false)
const selectedDate = ref(['1999', '01', '01'])
const minDate = new Date(1900, 1, 1)
const maxDate = new Date()
const selectedTime = ref(['12', '00'])

function onSubmit() {
  const { name, birthdayYMD } = userInfo.value
  // 阳历转农历
  const { lYear, lMonth, lDay } = solar2lunar(birthdayYMD[0], birthdayYMD[1], birthdayYMD[2])

  const result = {
    name: name || '无名氏',
    d: `${lYear}-${lMonth}-${lDay}`,
    t: hmsValue.value,
  }
  resultData.value = result
}

function handleDateConfirm(value: any) {
  userInfo.value.birthdayYMD = value.selectedValues
  showPicker.value = false
}

function handleTimeConfirm(value: any) {
  userInfo.value.birthdayHMS = value.selectedValues
  showTimer.value = false
}

// back
const onClickLeft = () => history.back()
</script>

<template>
  <VanNavBar title="⭐ 命盘" left-arrow fixed @click-left="onClickLeft" />

  <div class="container">
    <van-form @submit="onSubmit">
      <van-cell-group title="个人信息" inset>
        <van-field v-model="userInfo.name" name="姓名" label="姓名" placeholder="输入姓名" />
        <van-field
          v-model="ymdValue" readonly name="出生年月日选择" label="出生年月日" placeholder="点击选择出生年月日"
          :rules="[{ required: true, message: '请填写出生年月日' }]" @click="showPicker = true"
        />
        <van-field
          v-model="hmsValue" readonly name="出生时分秒选择" label="出生时分秒" placeholder="点击选择出生时分秒"
          :rules="[{ required: true, message: '请填写出生时分秒' }]" @click="showTimer = true"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          排盘
        </van-button>
      </div>
    </van-form>
    <natal-chart v-if="resultData" :result="resultData" />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-date-picker
        v-model="selectedDate" title="选择出生年月日" :min-date="minDate" :max-date="maxDate"
        @confirm="handleDateConfirm" @cancel="showPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="showTimer" position="bottom">
      <van-time-picker
        v-model="selectedTime" :columns-type="['hour', 'minute', 'second']" title="选择出生时分秒"
        @confirm="handleTimeConfirm" @cancel="showTimer = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 60px 16px;
  position: relative;
}

.chart {
  width: 100%;
  height: 300px;
  background: #fff;
}

.chart.item {
  margin-top: 15px;
}

[data-theme='dark'] {
  .chart {
    color: #fff;
    background: #222;
  }
}
</style>
