const express = require('express')
const { faker } = require('@faker-js/faker')

const generatePost = () => {

    const post = {
        title: faker.lorem.words(6),
        body: faker.lorem.sentence(12),
        fecha: new Date().toLocaleString(),
        img:`/img/postCards/${Math.round(Math.random() * (12 - 1) + 1)}-min.png`,
        emoji: faker.internet.emoji(),
        user: faker.name.fullName()
    }
    
    return post
}

module.exports = {
    generatePost
}
