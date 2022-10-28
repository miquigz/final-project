const express = require('express')
const { faker } = require('@faker-js/faker')

const generatePost = () => {

    const post = {
        title: faker.lorem.words(6),
        body: faker.lorem.sentence(12),
        fecha: ''
    }
    
    return post
}

module.exports = {
    generatePost
}
