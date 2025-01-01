package com.fourbit.videostreaming.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.videostreaming.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
