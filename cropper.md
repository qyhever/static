# 在 Vue3 中使用 Cropper.js 实现图片剪切功能

## 描述
图片剪切在一些上传图片尤其是上传头像这些地方用的比较多的，由于项目用的是 ant-design-vue UI 库，社区的一些图片剪切组件可能与 antdv 的 upload 组件结合可能不太友好，所以封装了一个简单的模态框图片剪切组件，与 upload 组件搭配适用。

## 技术栈
- vue3
- typescript
- cropper.js
- File API


## 正式开始
在 ant-design-vue 文档注意到 upload 组件的 beforeUpload 钩子函数返回一个 Promise，如果 resolve 传入 File 或 Blob 对象则上传 resolve 传入对象。

我们可以利用这一点，中断上传，将 file, resolve 通过 emit 暴露到父组件，然后经过剪切处理后，调用 resolve 回传处理过后的 file 继续完成上传操作。

主要流程：
- beforeUpload 钩子函数暴露事件给父组件，`emit('file-change', file, resolve)`
- 父组件在事件回调打开图片剪切弹框
- 剪切完成后调用 resolve 回传处理后的 file 完成上传，`resolve(file)`

封装的 cropper 组件：
```vue
<template>
  <a-modal :width="840" v-model:visible="sVisible" @cancel="onCancel" @ok="onOk" forceRender>
    <div class="cropper-container">
      <div class="img-box">
        <img ref="imageEl" class="cropper-image" alt="404" />
      </div>
      <div class="control-container">
        <div ref="previewEl" class="preview-box"></div>
        <div class="control">
          <a-button type="primary" @click="onZoomSub">
            <template #icon>
              <MinusOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onZoomAdd">
            <template #icon>
              <PlusOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onRotateSub">
            <template #icon>
              <UndoOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onRotateAdd">
            <template #icon>
              <RedoOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onMove(0, -moveStep)">
            <template #icon>
              <ArrowUpOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onMove(moveStep, 0)">
            <template #icon>
              <ArrowRightOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onMove(0, moveStep)">
            <template #icon>
              <ArrowDownOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onMove(-moveStep, 0)">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onScaleX">
            <template #icon>
              <ColumnWidthOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="onScaleY">
            <template #icon>
              <ColumnHeightOutlined />
            </template>
          </a-button>
        </div>
        <a-button class="reset-button" type="primary" @click="onReset">重置</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import {
  MinusOutlined,
  PlusOutlined,
  UndoOutlined,
  RedoOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons-vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

// File 转 base64
function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      }
    })
    reader.addEventListener('error', reject)
    reader.readAsDataURL(file)
  })
}

type VFile = File & {
  uid: string
}

export default defineComponent({
  emits: ['update:visible', 'submit'],
  components: {
    MinusOutlined,
    PlusOutlined,
    UndoOutlined,
    RedoOutlined,
    ArrowUpOutlined,
    ArrowRightOutlined,
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ColumnHeightOutlined,
    ColumnWidthOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moveStep: {
      type: Number,
      default: 4
    },
    file: {
      type: Object as PropType<VFile>
    }
  },
  setup(props, { emit }) {
    const imageEl = ref<HTMLImageElement>()
    const previewEl = ref<HTMLDivElement>()
    const instance = ref<Cropper>()
    const sVisible = ref(false)

    watch(
      () => props.visible,
      newVal => {
        sVisible.value = props.visible
        if (newVal) {
          setTimeout(() => {
            if (imageEl.value && previewEl.value && props.file) {
              instance.value = new Cropper(imageEl.value, {
                preview: previewEl.value,
                checkCrossOrigin: false
              })
              fileToDataURI(props.file).then(dataURI => {
                instance.value?.replace(dataURI)
              })
            }
          }, 20)
        } else {
          instance.value?.destroy()
        }
      }
    )

    function onCancel() {
      emit('update:visible', false)
    }

    function onOk() {
      instance.value?.getCroppedCanvas().toBlob(blob => {
        if (blob && props.file) {
          const { type, name, uid } = props.file
          // 剪切结果，重新生成一个 File
          const newFile = new File([blob], name, { type }) as VFile
          newFile.uid = uid
          emit('submit', newFile)
          emit('update:visible', false)
        }
      })
    }

    function onZoomSub() {
      instance.value?.zoom(-0.1)
    }

    function onZoomAdd() {
      instance.value?.zoom(0.1)
    }

    function onRotateSub() {
      instance.value?.rotate(-45)
    }

    function onRotateAdd() {
      instance.value?.rotate(45)
    }

    function onReset() {
      instance.value?.reset()
    }

    function onMove(...rest: [number, number]) {
      instance.value?.move(...rest)
    }

    function onScaleX() {
      instance.value?.scaleX(-instance.value?.getData().scaleX)
    }

    function onScaleY() {
      instance.value?.scaleY(-instance.value?.getData().scaleY)
    }

    return {
      imageEl,
      previewEl,
      sVisible,
      onCancel,
      onOk,
      onZoomSub,
      onZoomAdd,
      onRotateSub,
      onRotateAdd,
      onReset,
      onMove,
      onScaleX,
      onScaleY
    }
  }
})
</script>

<style lang="less" scoped>
.bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
.img-box {
  display: inline-block;
  height: 340px;
  width: 430px;
  border: 1px solid #ebebeb;
  .bg;
  img {
    max-width: 100%;
    display: block;
  }
}
.control-container {
  display: inline-block;
  width: 350px;
  padding: 0 10px;
  vertical-align: top;
}
.preview-box {
  height: 150px !important;
  width: 150px !important;
  overflow: hidden;
  border: 1px solid #ebebeb;
  .bg;
}
.control {
  margin-top: 15px;
}
.control ::v-deep .ant-btn {
  margin-right: 8px;
  margin-bottom: 15px;
}
.reset-button {
  width: 100%;
}
</style>
```

## 配合 upload 组件使用
upload 组件也经过了封装，完成了双向绑定，可以直接在表单中使用。
```vue
<template>
  <div class="com-page p20">
    <CropImage v-model:visible="visible" @submit="onCropSubmit" :file="fileRef"></CropImage>
    <ComUploadImage
      ref="uploadImage"
      v-model:value="photo"
      :autoUpload="false"
      @file-change="onFileChange"
    ></ComUploadImage>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CropImage from '@/components/cropper/index.vue'
import { UploadImageComponent } from '@/components/upload-image/types'

export default defineComponent({
  components: {
    CropImage
  },
  setup() {
    const visible = ref(false)
    const photo = ref<string[]>([])
    const uploadImage = ref<UploadImageComponent>()
    const resolveFile = ref<(file: File) => void>()
    const fileRef = ref<File>()

    function onFileChange(file: File, resolve: (file: File) => void) {
      fileRef.value = file // file 传给 cropper modal 的
      visible.value = true // 打开 cropper modal
      resolveFile.value = resolve // 保存 resolve 函数
    }

    function onCropSubmit(file: File) {
      if (resolveFile.value) {
        resolveFile.value(file) // 调用 resolve 函数完成上传
      }
    }

    return {
      visible,
      fileRef,
      photo,
      uploadImage,
      onFileChange,
      onCropSubmit
    }
  }
})
</script>
```

## 总结
[预览地址](http://localhost:3000/vue-typescript/component/editUploadImage)，账号：lgf@163.com，密码：123456。
[ts版源码地址](https://github.com/lgf196/ant-simple-pro/blob/master/vue%2Btypescript/src/components/cropper/index.vue)
[js版源码地址](https://github.com/lgf196/ant-simple-pro/blob/master/vue/src/components/cropper/index.vue)
[cropper使用文档](http://blog.lgf196.top/ant-simple-pro-document/guide/vue-components/cropper.html#usage)

> [cropper](https://github.com/lgf196/ant-simple-pro/blob/master/vue%2Btypescript/src/components/cropper/index.vue)插件来自[ant-simple-pro](https://github.com/lgf196/ant-simple-pro)里面，[ant-simple-pro](https://github.com/lgf196/ant-simple-pro)有很多用vue3+ts开发的插件。[ant-simple-pro](https://github.com/lgf196/ant-simple-pro)简洁，美观，快速上手，支持3大框架。