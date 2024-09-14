package ro.tuc.ds2020.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors();
        http
                .authorizeRequests()
                .antMatchers("/public/**").permitAll() // Publicly accessible URLs
                .antMatchers("/client/**").hasRole("CLIENT") // URLs accessible to users with the "USER" role
                .antMatchers("/admin/**").hasRole("ADMIN") // URLs accessible to users with the "ADMIN" role
                .anyRequest().authenticated() // All other requests require authentication
                .and()
                .formLogin()
                .loginPage("/public/login")
                .defaultSuccessUrl("/public/login", true)
                .permitAll() // Allow access to the login page
                .and()
                .logout()
                .logoutUrl("/client/logout") // Custom logout URL
                .permitAll(); // Allow access to the logout URL
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // In-memory user store (you can replace this with your custom UserDetailsService)
        auth
                .inMemoryAuthentication()
                .withUser("client")
                .password(passwordEncoder().encode("password"))
                .roles("CLIENT")
                .and()
                .withUser("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
