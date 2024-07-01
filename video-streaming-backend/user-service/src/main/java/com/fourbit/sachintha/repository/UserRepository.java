package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
