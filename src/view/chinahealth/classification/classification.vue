<template>
    <div>
        <Row>
            <Col span="8">
            <classification-type-list @on-current-change="selectChange"></classification-type-list>
            </Col>
            <Col span="16">
            <classifications-list :classificationType="currentClassificationType"></classifications-list>
            </Col>
        </Row>
    </div>
</template>

<script>
import ClassificationApi from '@/api/chinahealth/classification'
import ClassificationTypeList from './classtype/classification-type-list'
import ClassificationsList from './classifications/classifications-list'
export default {
    name: 'classification',
    components: { ClassificationsList, ClassificationTypeList },
    data() {
        return {
            currentClassificationType: undefined,
        }
    },
    methods: {
        selectChange: function (currentRow) {
            this.currentClassificationType = currentRow;
        }
    }

}
</script>

<style scoped>
</style>
